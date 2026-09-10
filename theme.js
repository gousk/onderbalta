(() => {
  const root = document.documentElement;
  const key = 'portfolio-theme';
  try { if (localStorage.getItem(key) === 'deus-ex') root.dataset.theme = 'deus-ex'; } catch {}
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    const update = () => {
      const active = root.dataset.theme === 'deus-ex';
      button.textContent = active ? 'theme: deus ex' : 'theme: classic';
      button.setAttribute('aria-label', active ? 'switch to classic theme' : 'switch to deus ex theme');
      button.setAttribute('aria-pressed', String(active));
    };
    button.addEventListener('click', () => {
      if (root.dataset.theme === 'deus-ex') delete root.dataset.theme;
      else root.dataset.theme = 'deus-ex';
      try { localStorage.setItem(key, root.dataset.theme || 'classic'); } catch {}
      update();
      window.dispatchEvent(new Event('portfolio-theme-change'));
      window.dispatchEvent(new Event('resize'));
    });
    update();
    document.body.append(button);
  });
})();
