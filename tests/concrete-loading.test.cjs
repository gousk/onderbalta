const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');
const loaderSource = source.slice(source.indexOf('const concreteTextureLoader ='), source.indexOf('const concreteColorTexture ='));

function fixture() {
  const requests = [], timers = new Map(), warnings = [];
  let timerId = 0;
  class Texture {
    constructor(image) { this.source = { data: image }; this.version = 0; }
    get image() { return this.source.data; }
    set image(image) { this.source.data = image; }
    set needsUpdate(value) { if (value) this.version++; }
    dispose() { this.disposed = true; }
  }
  const context = vm.createContext({
    THREE: { Texture, TextureLoader: class { load(url, ok, progress, fail) { requests.push({ url, ok, fail }); } } },
    document: { createElement: () => ({ getContext: () => ({ fillRect() {} }) }) },
    renderer: { capabilities: { getMaxAnisotropy: () => 8 } },
    console: { warn: message => warnings.push(message) },
    window: {
      setTimeout(fn, delay) { timers.set(++timerId, { fn, delay }); return timerId; },
      clearTimeout(id) { timers.delete(id); },
    },
  });
  vm.runInContext(loaderSource + '\nthis.texture = loadConcreteTexture("/concrete.jpg"); this.ready = Promise.all(concreteTextureLoads); this.copies = concreteTextureCopies.get(texture);', context);
  function tick(delay) {
    const entry = [...timers].find(([, timer]) => timer.delay === delay);
    assert.ok(entry, `Expected timer ${delay}`);
    timers.delete(entry[0]); entry[1].fn();
  }
  return { context, requests, timers, warnings, tick, Texture };
}

test('successful load replaces the placeholder and invalidates every surface copy', async () => {
  const f = fixture();
  const copy = new f.Texture(); copy.source = f.context.texture.source;
  f.context.copies.add(copy);
  assert.ok(f.context.texture.image);
  const image = { width: 2048 };
  f.requests[0].ok(new f.Texture(image));
  await f.context.ready;
  assert.equal(copy.image, image);
  assert.equal(copy.version, 1);
  assert.equal(copy.disposed, true);
  assert.equal(f.timers.size, 0);
});

test('connection failure retries with a fresh URL and can recover', async () => {
  const f = fixture();
  f.requests[0].fail(); f.tick(500);
  assert.equal(f.requests[1].url, '/concrete.jpg?retry=2');
  f.requests[1].ok(new f.Texture({ width: 2048 }));
  await f.context.ready;
  assert.equal(f.context.texture.image.width, 2048);
  assert.equal(f.warnings.length, 0);
});

test('permanent failure settles with a usable fallback after three attempts', async () => {
  const f = fixture(), placeholder = f.context.texture.image;
  f.requests[0].fail(); f.tick(500);
  f.requests[1].fail(); f.tick(1000);
  f.requests[2].fail();
  await f.context.ready;
  assert.equal(f.context.texture.image, placeholder);
  assert.equal(f.requests.length, 3);
  assert.equal(f.warnings.length, 1);
  assert.equal(f.timers.size, 0);
});

test('stalled requests time out; late callbacks cannot overwrite a recovered texture', async () => {
  const f = fixture();
  f.tick(12000); f.tick(500);
  const image = { width: 2048 };
  f.requests[1].ok(new f.Texture(image));
  f.requests[0].ok(new f.Texture({ width: 1 }));
  await f.context.ready;
  assert.equal(f.context.texture.image, image);
  assert.equal(f.timers.size, 0);
});
