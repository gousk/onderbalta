(() => {
  const header = document.querySelector('.cutout-name');
  if (!header) return;
  const themeKey = () => document.documentElement.dataset.theme === 'deus-ex' ? 'onder-letter-design-v4-deus-ex' : 'onder-letter-design-v3';
  let key = themeKey();
  const defaultHeader = header.firstElementChild.cloneNode(true);
  const drafts = new Map();
  function readDesign() {
    if (drafts.has(key)) return drafts.get(key);
    try { const saved=JSON.parse(localStorage.getItem(key)); if(saved) return saved; } catch {}
    return key.endsWith('-deus-ex') ? window.deusExHeaderDefault : null;
  }
  const positions = [...'onder'];
  const classicInitial = [{"id":"O_14","height":60,"gap":0,"y":10,"angle":-5,"hue":125,"saturation":300,"contrast":100,"brightness":100,"resolution":75},{"id":"N_17","height":54,"gap":-14,"y":9,"angle":2,"hue":-22,"saturation":300,"contrast":100,"brightness":100,"resolution":75},{"id":"D_18","height":77,"gap":-18,"y":-6,"angle":-18,"hue":-11,"saturation":300,"contrast":100,"brightness":120,"resolution":80},{"id":"TECH_IE_GLOSSY","height":68,"gap":-26,"y":15,"angle":5,"hue":0,"saturation":100,"contrast":100,"brightness":100,"resolution":100},{"id":"R_18","height":63,"gap":-22,"y":4,"angle":-11,"hue":25,"saturation":300,"contrast":100,"brightness":100,"resolution":75}];
  const initial = () => key.endsWith('-deus-ex') && window.deusExHeaderDefault ? window.deusExHeaderDefault.letters : classicInitial;
  let state = structuredClone(initial()), selected = 0, catalog, panel, timer, generation = 0;
  let rendered = null;
  function composition(src, layers = []) {
    const wrap = document.createElement('span');
    wrap.style.cssText = 'display:block;position:relative;max-width:100%;width:fit-content';
    const base = new Image(); base.alt = ''; base.src = src; wrap.append(base);
    for (const layer of layers) {
      const im = new Image(); im.alt = ''; im.src = layer.src;
      im.style.cssText = 'position:absolute;max-width:none;height:auto;';
      Object.assign(im.style, {left:layer.left+'%',top:layer.top+'%',width:layer.width+'%',height:layer.height+'%',transform:'rotate('+layer.angle+'deg)',filter:layer.filter});
      wrap.append(im);
    }
    return wrap;
  }
  const setHeader = (src, layers = []) => {
    header.replaceChildren(composition(src, layers));
    header.querySelector('img').onload = () => window.dispatchEvent(new Event('resize'));
  };
  try {
    const saved = readDesign();
    if (saved?.png?.startsWith('data:image/png;base64,')) setHeader(saved.png, saved.layers || []);
  } catch {}
  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'letter-editor-toggle'; toggle.textContent = 'letters';
  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'letter-editor');
  document.body.append(toggle);
  const fields = [
    ['height','size',30,110,1,'px'], ['gap','space before',-30,25,1,'px'],
    ['y','move down',-20,30,1,'px'], ['angle','tilt',-25,25,1,'°'],
    ['hue','hue',-180,180,1,'°'], ['saturation','color',0,300,5,'%'],
    ['contrast','contrast',50,200,5,'%'], ['brightness','brightness',40,180,5,'%'],
    ['resolution','resolution',25,100,5,'%']
  ];
  function validate(input) {
    if (!Array.isArray(input) || input.length !== 5) throw new Error('choose an exported letter settings file');
    return input.map((v,i) => {
      if (!v || !catalog[positions[i]].some(item => item.id === v.id)) throw new Error('unknown letter in settings');
      const item = {id:v.id};
      for (const [name,,min,max] of fields) {
        if (!Number.isFinite(v[name])) throw new Error('invalid settings');
        item[name] = Math.max(min,Math.min(max,v[name]));
      }
      return item;
    });
  }
  const images = new Map();
  function loadImage(id,src) {
    if (!images.has(id)) images.set(id,new Promise((resolve,reject) => {
      const im = new Image(); im.onload = () => resolve(im); im.onerror = () => reject(new Error('could not load letter')); im.src = src;
    }));
    return images.get(id);
  }
  function status(text) { panel.querySelector('[role=status]').textContent = text; }
  async function render() {
    const current = ++generation;
    const renderKey = key;
    const snapshot = structuredClone(state);
    try {
      const tiles = await Promise.all(snapshot.map(async (s,i) => {
        const entry = catalog[positions[i]].find(item => item.id === s.id);
        const im = await loadImage(entry.id,entry.src);
        const w = Math.round(im.naturalWidth * s.height / im.naturalHeight), h = s.height;
        const small = document.createElement('canvas');
        small.width = Math.max(1,Math.round(w*s.resolution/100)); small.height = Math.max(1,Math.round(h*s.resolution/100));
        const ctx = small.getContext('2d'); ctx.drawImage(im,0,0,small.width,small.height);
        // Pixel color adjustments also work in Safari and on file:// pages.
        const data = ctx.getImageData(0,0,small.width,small.height), a = data.data;
        const angle = s.hue*Math.PI/180, cos = Math.cos(angle), sin = Math.sin(angle);
        for (let p=0;p<a.length;p+=4) {
          const r=a[p],g=a[p+1],b=a[p+2];
          const rr=(.213+.787*cos-.213*sin)*r+(.715-.715*cos-.715*sin)*g+(.072-.072*cos+.928*sin)*b;
          const gg=(.213-.213*cos+.143*sin)*r+(.715+.285*cos+.140*sin)*g+(.072-.072*cos-.283*sin)*b;
          const bb=(.213-.213*cos-.787*sin)*r+(.715-.715*cos+.715*sin)*g+(.072+.928*cos+.072*sin)*b;
          const gray=.213*rr+.715*gg+.072*bb;
          [rr,gg,bb].forEach((v,k) => {a[p+k]=((gray+(v-gray)*s.saturation/100-128)*s.contrast/100+128)*s.brightness/100;});
        }
        ctx.putImageData(data,0,0);
        const rad=s.angle*Math.PI/180;
        const tile=document.createElement('canvas');
        tile.width=Math.ceil(Math.abs(w*Math.cos(rad))+Math.abs(h*Math.sin(rad)))+2;
        tile.height=Math.ceil(Math.abs(w*Math.sin(rad))+Math.abs(h*Math.cos(rad)))+2;
        const t=tile.getContext('2d');t.imageSmoothingEnabled=false;t.translate(tile.width/2,tile.height/2);t.rotate(rad);t.drawImage(small,-w/2,-h/2,w,h);
        tile.gifWidth=w;return tile;
      }));
      if (current !== generation || renderKey !== key) return;
      const xs=[0];
      for (let i=1;i<5;i++) xs[i]=xs[i-1]+tiles[i-1].width+snapshot[i].gap;
      const minX=Math.min(...xs), minY=Math.min(...snapshot.map(s=>s.y));
      const canvas=document.createElement('canvas');
      canvas.width=Math.ceil(Math.max(...tiles.map((t,i)=>xs[i]+t.width))-minX);
      canvas.height=Math.ceil(Math.max(...tiles.map((t,i)=>snapshot[i].y+t.height))-minY);
      const ctx=canvas.getContext('2d');tiles.forEach((t,i)=>ctx.drawImage(t,xs[i]-minX,snapshot[i].y-minY));
      rendered=canvas;
      const display=document.createElement('canvas');display.width=canvas.width;display.height=canvas.height;
      const dc=display.getContext('2d'),layers=[];
      tiles.forEach((tile,i)=>{
        const s=snapshot[i],entry=catalog[positions[i]].find(e=>e.id===s.id);
        if (!entry.animated) {dc.drawImage(tile,xs[i]-minX,s.y-minY);return;}
        // Keep the original GIF as an image; drawing it to canvas freezes its animation.
        const h=s.height,w=tile.gifWidth;
        layers.push({src:entry.src,left:100*(xs[i]-minX+(tile.width-w)/2)/canvas.width,
          top:100*(s.y-minY+(tile.height-h)/2)/canvas.height,width:100*w/canvas.width,height:100*h/canvas.height,
          angle:s.angle,filter:'hue-rotate('+s.hue+'deg) saturate('+s.saturation+'%) contrast('+s.contrast+'%) brightness('+s.brightness+'%)'});
      });
      const png=display.toDataURL('image/png');
      setHeader(png,layers);panel.querySelector('.letter-preview').replaceChildren(composition(png,layers));
      drafts.set(renderKey,{letters:snapshot,png,layers});
      try {localStorage.setItem(renderKey,JSON.stringify({letters:snapshot,png,layers}));status(layers.length ? 'saved — gifs stay animated; png download is a still image' : 'saved in this browser');}
      catch {status('browser storage unavailable — download your settings to keep them');}
    } catch (e) {status(e.message);}
  }
  function queueRender() {clearTimeout(timer);timer=setTimeout(render,35);}
  function updateControls() {
    panel.querySelector('.letter-theme-label').textContent = 'editing: ' + (key.endsWith('-deus-ex') ? 'deus ex' : 'classic');
    panel.querySelectorAll('[data-position]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.position===selected)));
    for (const [name] of fields) {
      const input=panel.querySelector(`[name="${name}"]`);input.value=state[selected][name];input.nextElementSibling.value=input.value;
      input.disabled=name==='gap' && selected===0;
    }
    const bank=panel.querySelector('.letter-bank');bank.replaceChildren();
    const category = panel.querySelector('.letter-category').value;
    let count=0;
    for (const entry of catalog[positions[selected]].filter(item => category === 'all' || (item.category || 'cutouts') === category)) {
      count++;const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',entry.label || entry.id.toLowerCase());b.title=entry.label || entry.id.toLowerCase();b.setAttribute('aria-pressed',String(entry.id===state[selected].id));
      const img=new Image();img.src=entry.src;img.alt='';img.loading='lazy';
      const caption=document.createElement('span');caption.textContent=entry.label || entry.id.toLowerCase();b.append(img,caption);
      b.onclick=()=>{state[selected].id=entry.id;if(entry.animated)Object.assign(state[selected],{hue:0,saturation:100,contrast:100,brightness:100});updateControls();queueRender();};bank.append(b);
    }
    if(!count)bank.textContent='no sprites in this category for this letter yet';
  }
  function download(blob,name) {
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function build() {
    panel=document.createElement('section');panel.id='letter-editor';panel.className='window letter-editor';panel.setAttribute('aria-label','header letter editor');
    panel.innerHTML=`<div class="title-bar">header letters <button type="button" class="letter-close" aria-label="close letter editor">×</button></div>
      <div class="letter-editor-body">
      <p class="letter-theme-label"></p>
      <div class="letter-preview"><img alt="header preview" src="${header.querySelector('img')?.src || ''}"></div>
      <div class="letter-positions" aria-label="choose a letter position">${positions.map((c,i)=>`<button type="button" data-position="${i}" aria-pressed="false">${c}</button>`).join('')}</div>
      <label class="letter-category-label">sprites <select class="letter-category"><option value="all">all</option><option value="y2k">y2k</option><option value="gifs">gifs / objects</option><option value="tech">tech logos</option><option value="cutouts">paper cutouts</option></select></label>
      <div class="letter-bank" aria-label="letter variants"></div>
      <div class="letter-controls">${fields.map(([name,label,min,max,step,unit])=>`<label>${label}<input type="range" name="${name}" min="${min}" max="${max}" step="${step}"><output></output><span>${unit}</span></label>`).join('')}</div>
      <div class="letter-actions"><button type="button" data-action="reset">reset this letter</button><button type="button" data-action="colors">original colors</button><button type="button" data-action="png">download png</button><button type="button" data-action="save">save settings</button><button type="button" data-action="load">load settings</button><input type="file" accept="application/json,.json" hidden></div>
      <p role="status" aria-live="polite">choose a letter, then a sprite. changes save automatically.</p></div>`;
    document.body.append(panel);
    panel.querySelector('.letter-preview').replaceChildren(header.firstElementChild.cloneNode(true));
    try {const saved=readDesign();if(saved?.letters)state=validate(saved.letters);}catch{}
    panel.querySelector('.letter-close').onclick=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();};
    panel.addEventListener('keydown',e=>{if(e.key==='Escape')panel.querySelector('.letter-close').click();});
    panel.querySelectorAll('[data-position]').forEach(b=>b.onclick=()=>{selected=+b.dataset.position;updateControls();});
    panel.querySelectorAll('input[type=range]').forEach(input=>input.oninput=()=>{state[selected][input.name]=+input.value;input.nextElementSibling.value=input.value;queueRender();});
    panel.querySelector('[data-action=reset]').onclick=()=>{state[selected]={...initial()[selected],id:state[selected].id};updateControls();queueRender();};
    panel.querySelector('[data-action=colors]').onclick=()=>{Object.assign(state[selected],{hue:0,saturation:100,contrast:100,brightness:100});updateControls();queueRender();};
    panel.querySelector('[data-action=png]').onclick=async()=>{clearTimeout(timer);await render();if(rendered)rendered.toBlob(b=>{if(b)download(b,'onder-header.png');});};
    panel.querySelector('[data-action=save]').onclick=()=>download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),'onder-header-settings-' + (key.endsWith('-deus-ex') ? 'deus-ex' : 'classic') + '.json');
    const file=panel.querySelector('input[type=file]');panel.querySelector('[data-action=load]').onclick=()=>file.click();
    file.onchange=async()=>{try {if(!file.files[0])return;state=validate(JSON.parse(await file.files[0].text()));updateControls();queueRender();}catch(e){status(e.message);}file.value='';};
    panel.querySelector('.letter-category').onchange=updateControls;
    updateControls();
  }
  window.addEventListener('portfolio-theme-change', () => {
    // Keep unfinished edits with their original theme and invalidate pending renders.
    if (catalog) drafts.set(key,{...readDesign(),letters:structuredClone(state)});
    clearTimeout(timer); generation++; rendered=null;
    key=themeKey();
    const saved=readDesign();
    state=structuredClone(initial());
    if (catalog && saved?.letters) {try {state=validate(saved.letters);} catch {}}
    if (saved?.png?.startsWith('data:image/png;base64,')) setHeader(saved.png,saved.layers || []);
    else header.replaceChildren(defaultHeader.cloneNode(true));
    if (panel) {
      panel.querySelector('.letter-preview').replaceChildren(header.firstElementChild.cloneNode(true));
      updateControls();
      if (saved?.letters) render();
      else status('choose letters for this theme. changes save separately.');
    }
    window.dispatchEvent(new Event('resize'));
  });
  toggle.onclick=async()=>{
    if(panel){panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));return;}
    toggle.disabled=true;toggle.textContent='loading…';
    try {
      await Promise.all(['assets/letter-catalog.js','assets/tech-letter-catalog.js?v=nr1','assets/y2k-letter-catalog.js','assets/gif-letter-catalog.js'].map(src => new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('letter catalog is missing'));};document.head.append(script);}))); 
      if(!window.letterCatalog || !window.techLetterCatalog || !window.y2kLetterCatalog || !window.gifLetterCatalog)throw new Error('letter catalog is missing');
      catalog=Object.fromEntries(positions.map(c=>[c,[...window.gifLetterCatalog[c],...window.y2kLetterCatalog[c],...window.techLetterCatalog[c],...window.letterCatalog[c]]]));
      build();toggle.setAttribute('aria-expanded','true');
    } catch(e) {toggle.title=e.message;toggle.textContent='retry letters';}
    finally {toggle.disabled=false;if(panel)toggle.textContent='letters';}
  };
})();
