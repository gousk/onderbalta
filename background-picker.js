const backgrounds = [{"name": "rocks", "src": "assets/rocks.jpg"}, {"name": "chess pattern", "src": "assets/chess-pattern.gif"}, {"name": "pattern 201", "src": "assets/pattern-201.gif"}, {"name": "pattern 8", "src": "assets/collected-backgrounds/pattern 8.jpg"}, {"name": "pattern 5", "src": "assets/collected-backgrounds/pattern 5.jpg"}, {"name": "pattern 159", "src": "assets/collected-backgrounds/pattern 159.gif"}, {"name": "pattern 157", "src": "assets/collected-backgrounds/pattern 157.gif"}, {"name": "pattern 155", "src": "assets/collected-backgrounds/pattern 155.gif"}, {"name": "pattern 125", "src": "assets/collected-backgrounds/pattern 125.jpg"}, {"name": "pattern 122", "src": "assets/collected-backgrounds/pattern 122.gif"}, {"name": "pattern 121", "src": "assets/collected-backgrounds/pattern 121.gif"}, {"name": "faces", "src": "assets/collected-backgrounds/faces.gif"}, {"name": "circut board", "src": "assets/collected-backgrounds/circut board.jpg"}, {"name": "circut board 3", "src": "assets/collected-backgrounds/circut board 3.jpg"}, {"name": "chain link fence 2", "src": "assets/collected-backgrounds/chain link fence 2.gif"}, {"name": "cat", "src": "assets/collected-backgrounds/cat.jpg"}, {"name": "bricks", "src": "assets/collected-backgrounds/bricks.jpg"}, {"name": "1078", "src": "assets/collected-backgrounds/1078.GIF"}];
(() => {
  const host = document.querySelector('header');
  if (!host) return;
  const picker = document.createElement('details');
  picker.className = 'background-picker';
  picker.innerHTML = `<summary>background picker</summary>
    <div class="picker-controls">
      <label>background <select id="background-choice"></select></label>
      <button type="button" id="background-prev" aria-label="previous background">previous</button>
      <button type="button" id="background-next" aria-label="next background">next</button>
      <label>tile size <input id="background-scale" type="number" min="0.5" max="3" step="0.05" value="1.6"> <output id="background-size"></output></label>
      <label><input id="grid-align" type="checkbox" checked> align panels to grid</label>
      <span id="background-status" role="status"></span>
    </div>`;
  host.append(picker);
  picker.hidden = true;
  picker.open = true;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'picker-toggle';
  toggle.textContent = 'bg';
  toggle.setAttribute('aria-label', 'show background picker');
  toggle.setAttribute('aria-expanded', 'false');
  picker.id = 'background-picker';
  toggle.setAttribute('aria-controls', picker.id);
  document.body.append(toggle);
  toggle.addEventListener('click', () => {
    picker.hidden = !picker.hidden;
    toggle.setAttribute('aria-expanded', String(!picker.hidden));
    toggle.setAttribute('aria-label', picker.hidden ? 'show background picker' : 'hide background picker');
    alignBackground();
  });
  const choice = picker.querySelector('select');
  const scale = picker.querySelector('#background-scale');
  const aligned = picker.querySelector('#grid-align');
  const output = picker.querySelector('output');
  const status = picker.querySelector('[role="status"]');
  for (const item of backgrounds) choice.add(new Option(item.name, item.src));
  choice.add(new Option('plain white', ''));
  const backgroundKey = () => document.documentElement.dataset.theme === 'deus-ex'
    ? 'portfolio-background-deus-ex' : 'portfolio-background';
  const selections = new Map();
  function restoreBackground() {
    choice.value = 'assets/pattern-201.gif';
    scale.value = 1.6;
    aligned.checked = true;
    let saved = selections.get(backgroundKey());
    try { saved ||= JSON.parse(localStorage.getItem(backgroundKey())); } catch {}
    if (saved && [...choice.options].some(o => o.value === saved.src)) {
      choice.value = saved.src;
      aligned.checked = saved.aligned !== false;
      if (Number.isFinite(saved.scale) && saved.scale >= .5 && saved.scale <= 3) scale.value = saved.scale;
    }
  }
  restoreBackground();
  const panel = document.querySelector('.window');
  const page = document.querySelector('.page');
  const gallery = page.querySelector('.home-layout');
  const cards = gallery ? [...gallery.querySelectorAll('.window')] : [];
  let tileWidth = 24, tileHeight = 24;
  function alignBackground() {
    if (!panel) return;
    const enabled = aligned.checked;
    // Use the same column grid and outer edges on every page.
    const available = Math.max(24, Math.min(1128, document.documentElement.clientWidth - 32));
    const count = available >= 760 ? 2 : 1;
    const columnWidth = Math.floor((available - (count - 1) * 24) / count / 24) * 24;
    const width = columnWidth * count + (count - 1) * 24;
    page.classList.toggle('tile-aligned', enabled);
    if (enabled) {
      // Keep the layout on one fixed grid, independent of the wallpaper.
      const x = 48;
      const y = 48;
      page.style.width = width + 'px';
      page.style.setProperty('--grid-x', x + 'px');
      page.style.setProperty('--grid-y', y + 'px');
      page.style.setProperty('--about-width', Math.round(340 / x) * x + 'px');
      page.style.setProperty('--nav-width', Math.ceil(112 / x) * x + 'px');
    } else page.style.width = '';
    if (gallery) {
      gallery.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
      const columns = Array.from({length: count}, () => {
        const column = document.createElement('div');
        column.className = 'media-column';
        return column;
      });
      cards.forEach((card, i) => columns[i % count].append(card));
      gallery.replaceChildren(...columns);
    }
    // Reset before measuring, so repeated updates never accumulate cropping.
    const windows = [...page.querySelectorAll('.window')];
    windows.forEach(win => {
      const body = win.querySelector('.window-body');
      const image = win.querySelector('.scene-loop');
      if (body) body.style.paddingBottom = '';
      if (image) image.style.height = '';
    });
    if (enabled) {
      // The reference pattern has a dot every 24px at 1.5×.
      // Remove less than one dot interval; never pad up or clip text.
      const step = 24;
      windows.forEach(win => {
        const height = win.getBoundingClientRect().height;
        const target = Math.floor((height + 0.01) / step) * step;
        const trim = Math.max(0, height - target);
        const body = win.querySelector('.window-body');
        const image = win.querySelector('.scene-loop');
        if (body) {
          const padding = parseFloat(getComputedStyle(body).paddingBottom);
          if (padding - trim >= 20) body.style.paddingBottom = `${padding - trim}px`;
        } else if (image) {
          const imageHeight = image.getBoundingClientRect().height;
          if (imageHeight > trim) image.style.height = `${imageHeight - trim}px`;
        }
      });
    }
    if (gallery) {
      const columns = [...gallery.children];
      const heights = columns.map(() => 0);
      cards.forEach(card => {
        const index = heights.indexOf(Math.min(...heights));
        columns[index].append(card);
        heights[index] += card.getBoundingClientRect().height + 24;
      });
    }
    const bounds = panel.getBoundingClientRect();
    document.documentElement.style.backgroundPosition =
      `${bounds.left + window.scrollX}px ${bounds.top + window.scrollY}px`;
  }
  window.addEventListener('resize', alignBackground);
  picker.addEventListener('toggle', alignBackground);
  document.querySelectorAll('img').forEach(img => img.addEventListener('load', alignBackground));
  document.fonts.ready.then(alignBackground);
  aligned.addEventListener('change', apply);
  let request = 0;
  function apply() {
    const current = ++request;
    const key = backgroundKey();
    const src = choice.value;
    const multiplier = Number(scale.value);
    const selection = {src, scale: multiplier, aligned: aligned.checked};
    selections.set(key, selection);
    output.value = String(multiplier) + '×';
    scale.disabled = !src;
    const finish = (width, height) => {
      if (current !== request || key !== backgroundKey()) return;
      const root = document.documentElement;
      root.style.backgroundImage = src ? `url("${encodeURI(src)}")` : 'none';
      root.style.backgroundColor = '#fff';
      root.style.backgroundSize = src ? `${Math.round(width * multiplier)}px ${Math.round(height * multiplier)}px` : 'auto';
      tileWidth = Math.max(1, Math.round(width * multiplier));
      tileHeight = Math.max(1, Math.round(height * multiplier));
      output.value = `${multiplier}× · ${tileWidth} × ${tileHeight}px`;
      alignBackground();
      status.textContent = `${choice.selectedIndex + 1} / ${choice.options.length}`;
      try { localStorage.setItem(key, JSON.stringify(selection)); }
      catch { status.textContent += ' · selection lasts for this page only'; }
    };
    if (!src) return finish(0, 0);
    const image = new Image();
    image.onload = () => finish(image.naturalWidth, image.naturalHeight);
    image.onerror = () => { if (current === request) status.textContent = 'could not load this background'; };
    image.src = src;
  }
  function changeBackground() {
    apply();
  }
  choice.addEventListener('change', changeBackground);
  scale.addEventListener('input', apply);
  for (const [id, direction] of [['background-prev', -1], ['background-next', 1]]) {
    picker.querySelector('#' + id).addEventListener('click', () => {
      choice.selectedIndex = (choice.selectedIndex + direction + choice.options.length) % choice.options.length;
      changeBackground();
    });
  }
  window.addEventListener('portfolio-theme-change', () => {
    restoreBackground();
    apply();
  });
  changeBackground();
})();
