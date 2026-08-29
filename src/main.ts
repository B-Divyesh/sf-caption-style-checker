import './style.css';
import { lint, SAMPLE_VTT, type Report } from './lint';

declare const __BUILD_ID__: string;

const app = document.querySelector<HTMLDivElement>('#app')!;
const storageKey = 'caption-source';
const demoMode = () => location.pathname === '/demo' || (location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1');
let demoSource = SAMPLE_VTT;
let realSource: string | null = demoMode() ? null : localStorage.getItem(storageKey) || '';
let profile = 'youtube';
let report: Report | null = null;
let activeCue = 0;

function currentSource() {
  if (demoMode()) return demoSource;
  if (realSource === null) realSource = localStorage.getItem(storageKey) || '';
  return realSource;
}
function updateSource(value: string) {
  if (demoMode()) demoSource = value;
  else {
    realSource = value;
    if (value) localStorage.setItem(storageKey, value);
    else localStorage.removeItem(storageKey);
  }
}

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Caption Style Checker — Check captions before upload', description: 'Check timed caption files for speed, long lines, speaker cues, markup, and placement settings before upload.' },
  '/demo': { title: 'Demo — Caption Style Checker', description: 'Try Caption Style Checker with an isolated sample caption file.' },
  '/privacy': { title: 'Privacy — Caption Style Checker', description: 'Learn how Caption Style Checker handles caption text in your browser.' },
  '/terms': { title: 'Terms — Caption Style Checker', description: 'Read the terms for Caption Style Checker.' },
  '/404': { title: 'Page not found — Caption Style Checker', description: 'Return to Caption Style Checker to check a caption file.' }
};
function route() { if (demoMode()) return '/demo'; return ['/', '/demo', '/privacy', '/terms'].includes(location.pathname) ? location.pathname : '/404'; }
function nav(path: string) {
  const destination = new URL(path, location.origin);
  history.pushState({}, '', `${destination.pathname}${destination.search}${destination.hash}`);
  render(!destination.hash);
  requestAnimationFrame(() => {
    if (destination.hash) document.querySelector(destination.hash)?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  });
}
window.addEventListener('popstate', () => render(true));
function esc(value: string) { const d = document.createElement('div'); d.textContent = value; return d.innerHTML; }
function tag(t: string) { return `<span class="tag ${t}">${t}</span>`; }
function renderReport() {
  report = null;
  const source = currentSource();
  if (!source) return `<section class="empty" aria-labelledby="empty-title"><p class="eyebrow">No caption file loaded</p><h2 id="empty-title">Drop a WebVTT, SRT, or timed TTML file</h2><p>Your checks will appear here. You can also paste caption text below.</p></section>`;
  const result = lint(source, profile);
  if ('error' in result) return `<section class="empty error" aria-live="polite"><p class="eyebrow">File needs attention</p><h2>We could not read that caption file</h2><p>${esc(result.error)}</p></section>`;
  report = result;
  const errors = result.findings.filter(x => x.level === 'error').length, warnings = result.findings.filter(x => x.level === 'warning').length;
  const summary = errors ? `${errors} fix${errors === 1 ? '' : 'es'} needed` : warnings ? `${warnings} warning${warnings === 1 ? '' : 's'} to review` : 'Ready to publish';
  return `<section class="report" aria-live="polite" aria-labelledby="report-title"><div class="report-head"><div><p class="eyebrow">${result.format} · ${result.cues.length} cues · ${Math.ceil(result.duration)} sec</p><h2 id="report-title">${summary}</h2><p>Profile: ${result.profile}</p></div><button class="secondary" id="export" type="button">Export report</button></div><div class="findings" tabindex="0" aria-label="Caption findings">${result.findings.length ? result.findings.map(f => `<article class="finding ${f.level}"><div>${tag(f.level)} ${f.cue ? `<span class="cue">Cue ${f.cue}</span>` : ''}</div><h3>${esc(f.title)}</h3><p>${esc(f.detail)}</p></article>`).join('') : `<article class="finding pass"><div>${tag('pass')}</div><h3>No issues in these checks</h3><p>Preview the cues below before you publish.</p></article>`}</div></section>`;
}
function checker() { return `<section class="checker" id="checker" aria-labelledby="checker-title"><div class="checker-top"><div><p class="eyebrow">Caption checker in your browser</p><h2 id="checker-title">Check a caption file</h2></div><label>Review profile<select id="profile"><option value="youtube" ${profile === 'youtube' ? 'selected' : ''}>Placement and markup review</option><option value="html5" ${profile === 'html5' ? 'selected' : ''}>WebVTT player review</option><option value="plain" ${profile === 'plain' ? 'selected' : ''}>Plain-text export review</option></select></label></div><div class="work-grid"><div><label class="drop" id="dropzone" for="file"><input id="file" type="file" accept=".vtt,.srt,.ttml,.xml,text/vtt,application/x-subrip,application/ttml+xml" /><strong>Choose a caption file</strong><span>or drop it here · WebVTT, SRT, timed TTML</span></label><label class="source-label" for="source">Caption text</label><textarea id="source" spellcheck="false" placeholder="Paste a caption file here">${esc(currentSource())}</textarea><div class="editor-actions"><button class="secondary" id="check" type="button">Check captions</button><button class="plain" id="clear" type="button">Clear</button></div></div><div id="results">${renderReport()}</div></div>${report ? preview(report) : ''}</section>`; }
function preview(r: Report) { const cue = r.cues[activeCue] || r.cues[0]; return `<section class="preview" aria-labelledby="preview-title"><div><p class="eyebrow">Cue preview</p><h2 id="preview-title">Read it in context</h2><p>Use the cue buttons to check line length and meaning.</p><div class="cue-list">${r.cues.map((c, i) => `<button type="button" data-cue="${i}" class="${i === activeCue ? 'active' : ''}">${String(i + 1).padStart(2, '0')} <span>${c.start.toFixed(1)}s</span></button>`).join('')}</div></div><figure class="screen"><figcaption>Accessible high-contrast preview</figcaption><div class="caption-box">${esc(cue.text || 'Empty cue')}</div></figure></section>`; }
function shell(content: string) { return `<header><a class="mark" href="/" data-link><span aria-hidden="true">▰</span> CAPTION//CHECK</a><nav aria-label="Primary"><a href="/demo" data-link>Demo</a><a href="/#checker" data-link>Checker</a><a href="/privacy" data-link>Privacy</a></nav></header>${demoMode() ? `<div class="demo" role="status">Demo — sample data, nothing is saved <button id="reset-demo" type="button">Reset demo</button><button id="real" type="button">Start for real</button></div>` : ''}<main id="main" tabindex="-1">${content}</main><footer><p>Caption checks for people publishing video lessons.</p><div><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory (external site)</a></div><small>v1.1.0 · generated art noted in design docs</small></footer><div class="announce" aria-live="polite"></div>`; }
function landing() { return shell(`<section class="hero"><div class="hero-copy"><p class="eyebrow">Caption checker in your browser</p><h1 tabindex="-1">Check captions before upload</h1><p class="lead">For video educators who need readable captions and clear speaker cues before publishing.</p><div class="actions"><div class="action-block"><button class="primary" id="demo" type="button">Try it with sample data</button><span>Loads a sample file and shows its warnings.</span></div></div><ul class="facts"><li>Caption text stays in this browser.</li><li>Works offline after one visit.</li><li>Free to use.</li></ul></div><figure class="hero-art"><img src="/assets/signal-desk.webp" width="1024" height="1024" fetchpriority="high" decoding="async" alt="Pixel-art caption timing monitor on a compact control desk." /><figcaption>Review caption settings before upload.</figcaption></figure></section>${checker()}<section class="how" aria-labelledby="how-title"><p class="eyebrow">How it works</p><h2 id="how-title">Check a caption file in three steps</h2><ol><li><b>Load</b><span>Drop a WebVTT, SRT, or timed TTML file.</span></li><li><b>Choose</b><span>Select the review profile you need.</span></li><li><b>Fix</b><span>Review fast cues, long lines, markup, placement, and speakers.</span></li></ol></section><section class="limits" aria-labelledby="limits-title"><h2 id="limits-title">What this checker does not do</h2><p>It checks timed caption files in this browser. Review the final upload before publishing.</p></section>`); }
function staticPage(kind: 'privacy' | 'terms' | '404') { const texts = kind === 'privacy' ? ['Privacy', 'Your caption text stays in this browser.', 'The checker sends no caption text to a server. Real mode saves the current text in this browser for refresh. Demo mode keeps its sample text only in memory.'] : kind === 'terms' ? ['Terms', 'Use the checker to review a timed caption file.', 'It displays file checks for you to review before publishing. The service is free to use and provided as-is.'] : ['Page not found', 'This page does not exist.', 'Use the home page to load a caption file.']; return shell(`<article class="legal"><p class="eyebrow">Caption checker</p><h1 tabindex="-1">${texts[0]}</h1><p class="lead">${texts[1]}</p><p>${texts[2]}</p>${kind === '404' ? '<a class="primary link-button" href="/" data-link>Return home</a>' : ''}</article>`); }
function render(focusHeading = false) {
  const path = route();
  const meta = pageMeta[path] || pageMeta['/404'];
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', meta.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = new URL(path === '/404' ? location.pathname : path, location.origin).href;
  app.innerHTML = path === '/' ? landing() : path === '/demo' ? shell(`<section class="demo-main"><p class="eyebrow">Sample caption file</p><h1 tabindex="-1">Check sample captions</h1><p class="lead">A realistic lesson intro with placement, speaker, and reading-speed checks.</p></section>${checker()}`) : staticPage(path.slice(1) as 'privacy' | 'terms' | '404');
  bind();
  if (focusHeading) requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus();
    const announcement = document.querySelector<HTMLElement>('.announce');
    if (announcement && heading) announcement.textContent = heading.textContent;
  });
}
function bind() {
  document.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); nav(a.getAttribute('href') || '/'); }));
  document.querySelector('#demo')?.addEventListener('click', () => nav('/demo'));
  document.querySelector('#real')?.addEventListener('click', () => { demoSource = SAMPLE_VTT; nav('/'); });
  document.querySelector('#reset-demo')?.addEventListener('click', () => { demoSource = SAMPLE_VTT; activeCue = 0; render(); });
  const textarea = document.querySelector<HTMLTextAreaElement>('#source'); const check = () => { if (textarea) updateSource(textarea.value); activeCue = 0; render(); };
  document.querySelector('#check')?.addEventListener('click', check); document.querySelector('#clear')?.addEventListener('click', () => { updateSource(''); activeCue = 0; render(); });
  document.querySelector<HTMLSelectElement>('#profile')?.addEventListener('change', e => { profile = (e.target as HTMLSelectElement).value; render(); });
  document.querySelector('#file')?.addEventListener('change', e => readFile((e.target as HTMLInputElement).files?.[0]));
  const dz = document.querySelector('#dropzone'); dz?.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); }); dz?.addEventListener('dragleave', () => dz.classList.remove('over')); dz?.addEventListener('drop', e => { const drag = e as DragEvent; drag.preventDefault(); dz.classList.remove('over'); readFile(drag.dataTransfer?.files[0]); });
  document.querySelectorAll<HTMLButtonElement>('[data-cue]').forEach(b => b.addEventListener('click', () => { activeCue = Number(b.dataset.cue); render(); }));
  document.querySelector('#export')?.addEventListener('click', () => { if (!report) return; const body = [`Caption Style Checker`, `Profile: ${report.profile}`, '', ...report.findings.map(f => `${f.level.toUpperCase()}${f.cue ? ` cue ${f.cue}` : ''}: ${f.title} — ${f.detail}`)].join('\n'); const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([body], { type: 'text/plain' })), download: 'caption-report.txt' }); a.click(); URL.revokeObjectURL(a.href); });
}
function readFile(file?: File) { if (!file) return; if (file.size > 2_000_000) { alert('This file is larger than 2 MB. Choose a smaller caption file.'); return; } const reader = new FileReader(); reader.onerror = () => alert('The file could not be read. Try choosing it again.'); reader.onload = () => { updateSource(String(reader.result || '')); activeCue = 0; render(); }; reader.readAsText(file); }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => { if (event.data?.type === 'shell-cached') (window as Window & { __captionShellCached?: boolean }).__captionShellCached = true; });
  navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(__BUILD_ID__)}`).then(async registration => {
    await navigator.serviceWorker.ready;
    const urls = performance.getEntriesByType('resource').map(entry => entry.name).filter(url => new URL(url).origin === location.origin);
    registration.active?.postMessage({ type: 'cache-page', urls });
  }).catch(() => {});
}
render();
