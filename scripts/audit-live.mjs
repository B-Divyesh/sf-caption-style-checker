import AxeBuilder from '@axe-core/playwright';
import { chromium, request } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const base = process.argv[2] || 'https://caption-style-checker.sociobot.in';
const evidence = process.argv[3] || '.factory/evidence/polish-5-live';
mkdirSync(evidence, { recursive: true });

const expectedRoutes = [
  ['/', 200, 'Caption Style Checker — Check captions before upload', 'Check captions before upload', '/'],
  ['/demo', 200, 'Demo — Caption Style Checker', 'Check sample captions', '/demo'],
  ['/privacy', 200, 'Privacy — Caption Style Checker', 'Privacy', '/privacy'],
  ['/terms', 200, 'Terms — Caption Style Checker', 'Terms', '/terms'],
  ['/not-a-real-page', 404, 'Page not found — Caption Style Checker', 'Page not found', '/not-a-real-page']
];

const browser = await chromium.launch();
const api = await request.newContext();
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const routeResults = [];
const axeResults = [];
const externalResults = [];
const historical = {};
const record = (id, condition, message) => {
  historical[id] = Boolean(condition);
  assert(condition, `${id}: ${message}`);
};

for (const [path, expectedStatus, expectedTitle, expectedHeading, canonicalPath] of expectedRoutes) {
  const response = await api.get(`${base}${path}`);
  routeResults.push({ path, status: response.status() });
  assert(response.status() === expectedStatus, `${path} returned ${response.status()}, expected ${expectedStatus}`);

  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const snapshot = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1Count: document.querySelectorAll('h1').length,
      heading: document.querySelector('h1')?.textContent?.trim(),
      mainCount: document.querySelectorAll('main').length,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      missingAlt: document.querySelectorAll('img:not([alt])').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    assert(snapshot.title === expectedTitle, `${path} ${viewport.name} title mismatch`);
    assert(snapshot.lang === 'en', `${path} ${viewport.name} missing lang=en`);
    assert(snapshot.h1Count === 1 && snapshot.heading === expectedHeading, `${path} ${viewport.name} h1 mismatch`);
    assert(snapshot.mainCount === 1, `${path} ${viewport.name} main mismatch`);
    assert(snapshot.canonical === `${base}${canonicalPath}`, `${path} ${viewport.name} canonical mismatch`);
    assert(Boolean(snapshot.description), `${path} ${viewport.name} description missing`);
    assert(snapshot.ogTitle === expectedTitle, `${path} ${viewport.name} Open Graph title mismatch`);
    assert(snapshot.missingAlt === 0, `${path} ${viewport.name} image missing alt`);
    assert(!snapshot.overflow, `${path} ${viewport.name} horizontal overflow`);
    const unexpectedErrors = path === '/not-a-real-page' ? errors.filter(error => !/status of 404/i.test(error)) : errors;
    assert(unexpectedErrors.length === 0, `${path} ${viewport.name} console errors: ${unexpectedErrors.join('; ')}`);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = axe.violations.filter(violation => ['serious', 'critical'].includes(violation.impact || ''));
    axeResults.push({ path, viewport: viewport.name, violations: axe.violations.length, serious: serious.length });
    assert(serious.length === 0, `${path} ${viewport.name} serious Axe violations`);
    await context.close();
  }
}

const rootContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const root = await rootContext.newPage();
await root.goto(`${base}/`, { waitUntil: 'networkidle' });
await root.screenshot({ path: join(evidence, 'root-mobile-cold.png'), fullPage: true });
const firstScreen = await root.evaluate(() => {
  const targets = [
    document.querySelector('h1'),
    document.querySelector('.lead'),
    document.querySelector('#demo'),
    document.querySelector('.action-block span')
  ];
  return {
    bottoms: targets.map(element => element?.getBoundingClientRect().bottom ?? Infinity),
    badPlatformChangeCopy: /Platform (?:support|rules) change/i.test(document.body.innerText),
    finalUploadGuidanceCount: (document.body.innerText.match(/Review the final upload before publishing\./g) || []).length,
    shareMetadata: Boolean(
      document.querySelector('link[rel="apple-touch-icon"][sizes="180x180"]') &&
      document.querySelector('meta[property="og:image:width"][content="1200"]') &&
      document.querySelector('meta[property="og:image:height"][content="630"]') &&
      document.querySelector('meta[name="twitter:image"]')
    ),
    skipText: document.querySelector('.skip')?.textContent?.trim(),
    limitations: document.querySelector('.limits')?.textContent?.replace(/\s+/g, ' ').trim(),
    clearAction: document.querySelector('#clear')?.textContent?.trim(),
    footerVersion: document.querySelector('footer small')?.textContent?.trim(),
    bodyText: document.body.innerText
  };
});
record('F-1-5', firstScreen.bottoms.every(bottom => bottom <= 844), `first-screen content below fold: ${firstScreen.bottoms.join(', ')}`);
record('F-1-6', firstScreen.bodyText.includes('WebVTT, SRT, timed TTML') && !firstScreen.bodyText.includes('WebVTT, SRT, TTML'), 'format wording does not consistently say timed TTML');
record('F-1-7', !/preflight|local preflight desk/i.test(firstScreen.bodyText), 'preflight or desk jargon returned');
record('F-1-8', /How it works/i.test(firstScreen.bodyText) && /Check a caption file in three steps/i.test(firstScreen.bodyText), 'three-step section headings are not plain');
record('F-4-1', !firstScreen.badPlatformChangeCopy && firstScreen.finalUploadGuidanceCount === 2, 'platform-change assertion remains or guidance is incomplete');
const limitationsCopyOk = firstScreen.limitations?.includes('It does not upload captions, edit video, translate speech, or predict the published result.') && firstScreen.limitations?.includes('Review the final upload before publishing.');
await root.keyboard.press('Tab');
const skipFocused = await root.locator('.skip').evaluate(element => element === document.activeElement);
await root.keyboard.press('Enter');
const skipMovedFocus = await root.locator('main').evaluate(element => element === document.activeElement);
record('F-5-2', firstScreen.skipText === 'Skip to main content' && skipFocused && skipMovedFocus, 'skip link does not accurately name and focus main content');
record('F-5-4', firstScreen.footerVersion === 'v1.1.0', 'footer exposes internal documentation text');
record('F-1-12', await root.getByRole('link', { name: 'Built by Param Factory (external site)' }).getAttribute('href') === 'https://sociobot.in', 'external footer label or URL is wrong');
await root.locator('header a[href="/privacy"]').focus();
await root.keyboard.press('Enter');
await root.waitForURL(`${base}/privacy`);
assert(await root.locator('h1').evaluate(element => element === document.activeElement), 'route navigation did not focus Privacy h1');
await root.goBack();
await root.waitForURL(`${base}/`);
assert(await root.locator('h1').evaluate(element => element === document.activeElement), 'Back did not focus root h1');
await root.locator('#file').focus();
const fileOutline = await root.locator('#dropzone').evaluate(element => getComputedStyle(element).outlineStyle);
assert(fileOutline === 'solid', 'file input focus is not visible on its drop zone');
await root.goto(`${base}/not-a-real-page`, { waitUntil: 'networkidle' });
record('F-1-9', firstScreen.bodyText.includes('Review caption settings before upload.') && await root.getByText('This page does not exist.').isVisible() && await root.getByRole('link', { name: 'Return home' }).isVisible(), 'art caption, direct 404 copy, or recovery link is missing');
await rootContext.close();

const demoRequests = [];
const demoContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
await demoContext.addInitScript(value => {
  localStorage.setItem('caption-source', value);
  const original = Storage.prototype.getItem;
  window.__storageReads = [];
  Storage.prototype.getItem = function (key) {
    window.__storageReads.push(key);
    return original.call(this, key);
  };
}, '1\n00:00:10,000 --> 00:00:12,000\nSaved real caption.');
const demo = await demoContext.newPage();
demo.on('request', req => demoRequests.push({ url: req.url(), method: req.method(), body: req.postData() }));
await demo.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
await demo.screenshot({ path: join(evidence, 'demo-desktop-cold.png'), fullPage: true });
assert((await demo.title()) === 'Demo — Caption Style Checker', 'query demo title mismatch');
assert(await demo.getByText('Demo — sample data, nothing is saved').isVisible(), 'demo isolation banner missing');
assert((await demo.locator('.finding').count()) === 11, 'sample does not open with 11 findings');
const demoDidNotReadReal = !(await demo.evaluate(() => window.__storageReads)).includes('caption-source');
const demoDidNotChangeReal = (await demo.evaluate(() => localStorage.getItem('caption-source'))) === '1\n00:00:10,000 --> 00:00:12,000\nSaved real caption.';
assert(demoDidNotReadReal, 'demo read real storage');
assert(demoDidNotChangeReal, 'demo changed real storage');
await demo.getByRole('button', { name: 'Clear caption text' }).click();
const clearEmptiedSource = (await demo.getByLabel('Caption text').inputValue()) === '';
const clearFocusedUndo = await demo.getByRole('button', { name: 'Undo clear' }).evaluate(element => element === document.activeElement);
await demo.getByRole('button', { name: 'Undo clear' }).click();
const undoRestoredSample = (await demo.getByLabel('Caption text').inputValue()).startsWith('WEBVTT');
const undoFocusedSource = await demo.getByLabel('Caption text').evaluate(element => element === document.activeElement);
record('F-5-3', firstScreen.clearAction === 'Clear caption text' && clearEmptiedSource && clearFocusedUndo && undoRestoredSample && undoFocusedSource, 'clear action label or one-action recovery failed');
const sampleResultText = await demo.locator('#results').innerText();
record('F-1-2', ['words per minute', 'Long caption line', 'Styled text found', 'Placement settings found', 'Markup to review', 'Speaker cue found'].every(copy => sampleResultText.includes(copy)), 'sample does not show every advertised category');
const previewStyles = [
  ['White on black', 'rgb(255, 255, 255)', 'rgb(1, 6, 7)'],
  ['Black on white', 'rgb(7, 21, 29)', 'rgb(255, 255, 255)'],
  ['Yellow on black', 'rgb(255, 223, 127)', 'rgb(1, 6, 7)']
];
let previewStylesPass = true;
for (const [name, color, background] of previewStyles) {
  await demo.getByLabel(name).check();
  const computed = await demo.locator('#preview-text').evaluate(element => {
    const value = getComputedStyle(element);
    return [value.color, value.backgroundColor];
  });
  previewStylesPass &&= computed[0] === color && computed[1] === background;
}
record('F-V3-4', previewStylesPass, 'one or more high-contrast preview styles changed');
const downloadEvent = demo.waitForEvent('download');
await demo.getByRole('button', { name: 'Export report' }).click();
const download = await downloadEvent;
const downloadPath = await download.path();
const exportText = downloadPath ? readFileSync(downloadPath, 'utf8') : '';
assert(download.suggestedFilename() === 'caption-report.txt', 'report filename mismatch');
assert(exportText.includes('Placement settings found') && exportText.includes('Check the final upload before publishing.'), 'export is missing visible scoped findings');
record('F-1-1', !/YouTube rendering|not supported by YouTube|may not survive/i.test(`${sampleResultText}\n${exportText}`), 'platform behavior wording returned to report or export');
const youtubeNote = await demo.locator('.profile-note').innerText();
const youtubeSource = await demo.locator('.profile-note a').getAttribute('href');
await demo.getByLabel('Publishing platform').focus();
await demo.getByLabel('Publishing platform').selectOption('html');
const platformFocus = await demo.getByLabel('Publishing platform').evaluate(element => element === document.activeElement);
const htmlNote = await demo.locator('.profile-note').innerText();
const htmlSource = await demo.locator('.profile-note a').getAttribute('href');
record('F-V4-5', youtubeNote.includes('Rules reviewed 29 August 2026') && htmlNote.includes('Rules reviewed 29 August 2026') && /support\.google\.com/.test(youtubeSource || '') && /developer\.mozilla\.org/.test(htmlSource || ''), 'dated platform guidance sources are incomplete');
await demo.getByLabel('Publishing platform').selectOption('youtube');
await demo.getByRole('button', { name: 'Check captions' }).focus();
await demo.keyboard.press('Enter');
const reportFocus = await demo.locator('#report-title').evaluate(element => element === document.activeElement);
record('F-V3-5', platformFocus && reportFocus, 'platform change or check moved focus to the wrong place');

const runCheck = async source => {
  await demo.getByLabel('Caption text').fill(source);
  await demo.getByRole('button', { name: 'Check captions' }).click();
  return demo.locator('#results').innerText();
};

const atThreshold = `1\n00:00:00,000 --> 00:00:10,000\n${Array(30).fill('word').join(' ')}`;
const aboveThreshold = `1\n00:00:00,000 --> 00:00:10,000\n${Array(31).fill('word').join(' ')}`;
const atThresholdResult = await runCheck(atThreshold);
const aboveThresholdResult = await runCheck(aboveThreshold);
record('F-1-3', !atThresholdResult.includes('words per minute') && aboveThresholdResult.includes('186 words per minute') && aboveThresholdResult.includes('180-word-per-minute guidance threshold'), '180 WPM boundary is wrong');

const malformedResult = await runCheck('1\n00:00:01,000 --> 00:00:03,000\nJORDAN: Valid cue.\n\n2\n00:00:61,000 --> 00:00:63,000\nInvalid seconds.');
record('F-V3-1', malformedResult.includes('Cue has an invalid timestamp') && !malformedResult.includes('Ready to publish'), 'malformed SRT cue reported ready');

await demo.getByLabel('Publishing platform').selectOption('html');
const htmlRuleResult = await runCheck('1\n00:00:01,000 --> 00:00:03,000\nSRT caption.');
record('F-V3-2', htmlRuleResult.includes('HTML video track needs WebVTT'), 'selected HTML platform rule did not run');
await demo.getByLabel('Publishing platform').selectOption('youtube');

const offsetTtmlResult = await runCheck('<tt><body><p begin="1s" end="3s">JORDAN: Offset caption.</p></body></tt>');
record('F-V3-3', offsetTtmlResult.includes('TTML') && offsetTtmlResult.includes('Speaker cue found'), 'offset-time TTML or speaker detection failed');
const reversedResult = await runCheck('1\n00:00:05,000 --> 00:00:03,000\nBackwards timing.');
record('F-V3-6', reversedResult.includes('End time is not after start time') && !reversedResult.includes('words per minute'), 'reversed timing produced a speed result');

await demo.getByLabel('Caption text').fill('1\n00:00:01,000 --> 00:00:03,000\nUNIQUE: unsubmitted caption.');
await demo.getByLabel('Publishing platform').selectOption('html');
record('F-V4-1', (await demo.getByLabel('Caption text').inputValue()).includes('UNIQUE: unsubmitted caption.'), 'platform rerender discarded unsubmitted input');
await demo.getByLabel('Publishing platform').selectOption('youtube');
const unsupportedVttResult = await runCheck('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\n<foo>Meaning</foo>');
record('F-V4-2', unsupportedVttResult.includes('Unsupported WebVTT tag') && !unsupportedVttResult.includes('Ready to publish'), 'unsupported WebVTT markup reported ready');
const durationTtmlResult = await runCheck('<tt><body><p begin="1s" dur="2s">JORDAN: Duration.</p></body></tt>');
record('F-V4-3', durationTtmlResult.includes('TTML · 1 CUE · 3 SEC') && !durationTtmlResult.includes('invalid timestamp'), 'TTML begin plus dur failed');
await runCheck('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nJORDAN: Fish &amp; chips &lt;fresh&gt; &#35;1');
record('F-V4-4', (await demo.locator('#preview-text').innerText()) === 'JORDAN: Fish & chips <fresh> #1', 'character references were not decoded in preview');

const semanticFixtures = [
  ['fv5-unsupported-markup.srt', 'Unsupported SRT tag'],
  ['fv5-styled-text.srt', 'Check SRT styling after upload'],
  ['fv5-referenced-color.ttml', 'Check TTML styling after upload'],
  ['fv5-referenced-placement.ttml', 'Placement settings found']
];
let semanticFixturesPass = true;
for (const [fixture, finding] of semanticFixtures) {
  const result = await runCheck(readFileSync(`tests/fixtures/${fixture}`, 'utf8'));
  semanticFixturesPass &&= result.includes(finding) && !result.includes('Ready to publish');
}
record('F-V5-1', semanticFixturesPass, 'an SRT or TTML semantic fixture reported ready');

await demo.getByLabel('Caption text').fill('1\n00:00:01,000 --> 00:00:03,000\nEdited demo caption.');
await demo.getByRole('button', { name: 'Check captions' }).click();
assert((await demo.locator('.report .eyebrow').innerText()).includes('SRT'), 'edited demo input was not checked');
await demo.getByRole('button', { name: 'Reset demo' }).click();
assert((await demo.getByLabel('Caption text').inputValue()).startsWith('WEBVTT'), 'Reset demo did not restore sample');
await demo.getByLabel('Caption text').fill(readFileSync('tests/fixtures/prefixed-timed.ttml', 'utf8'));
await demo.getByRole('button', { name: 'Check captions' }).click();
const prefixedTtml = (await demo.locator('.report .eyebrow').innerText()).toLowerCase().includes('ttml · 1 cue · 3 sec');
record('F-2-1', prefixedTtml, 'prefixed timed TTML failed live');
await demo.getByRole('button', { name: 'Start for real' }).click();
await demo.waitForURL(`${base}/`);
const restoredReal = (await demo.getByLabel('Caption text').inputValue()).includes('Saved real caption.');
await demo.reload({ waitUntil: 'networkidle' });
const refreshedReal = (await demo.getByLabel('Caption text').inputValue()).includes('Saved real caption.');
record('F-1-4', demoDidNotReadReal && demoDidNotChangeReal && restoredReal && refreshedReal, 'demo isolation or real refresh failed');
const demoRequestBoundaryPass = demoRequests.every(request => new URL(request.url).origin === base && request.method === 'GET');
record('F-5-1', limitationsCopyOk && demoRequestBoundaryPass, 'scope limits are absent or the caption flow made an upload request');
assert(demoRequestBoundaryPass, 'demo made a cross-origin or mutating runtime request');
await demoContext.close();

const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const offline = await offlineContext.newPage();
await offline.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
await offline.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
await offline.waitForFunction(() => window.__captionShellCached === true);
await offline.evaluate(async () => {
  const cache = await caches.open('caption-check-stale-live-audit');
  await cache.put('/?demo=1', new Response('<h1>Stale shell</h1>', { headers: { 'Content-Type': 'text/html' } }));
});
await offline.reload({ waitUntil: 'domcontentloaded' });
record('F-V4-6', await offline.getByRole('heading', { name: 'Check sample captions' }).isVisible() && await offline.getByText('Stale shell').count() === 0, 'online navigation served a stale cached shell');
await offlineContext.setOffline(true);
await offline.reload({ waitUntil: 'domcontentloaded' });
assert(await offline.getByRole('heading', { name: 'Check sample captions' }).isVisible(), 'offline demo reload failed');
await offlineContext.setOffline(false);
await offlineContext.close();

const resizeContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const resize = await resizeContext.newPage();
await resize.goto(`${base}/`, { waitUntil: 'networkidle' });
await resize.addStyleTag({ content: 'html { font-size: 200% !important; }' });
const resizeOverflow = await resize.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
assert(!resizeOverflow, 'root overflows horizontally at 200% text size');
await resize.screenshot({ path: join(evidence, 'root-mobile-text-200.png'), fullPage: true });
await resizeContext.close();

const stableAssetCache = {};
for (const asset of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon.svg', '/apple-touch-icon.png', '/assets/signal-desk.webp', '/assets/caption-checker-social.jpg']) {
  const response = await api.get(`${base}${asset}`);
  assert(response.status() === 200, `${asset} returned ${response.status()}`);
  if (asset.startsWith('/assets/')) stableAssetCache[asset] = response.headers()['cache-control'];
}
record('F-1-11', firstScreen.shareMetadata && Boolean(stableAssetCache['/assets/caption-checker-social.jpg']), 'social image or device metadata is unavailable');
record('F-V5-2', Object.values(stableAssetCache).every(value => value === 'public, max-age=0, must-revalidate'), 'stable art URL was marked immutable');
for (const url of [
  'https://support.google.com/youtube/answer/2734698?hl=en',
  'https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format',
  'https://sociobot.in'
]) {
  const response = await api.get(url);
  externalResults.push({ url, status: response.status() });
  assert(response.status() === 200, `${url} returned ${response.status()}`);
}

const rootResponse = await api.get(`${base}/`);
const csp = rootResponse.headers()['content-security-policy'] || '';
assert(csp.includes("frame-ancestors 'none'") && csp.includes("connect-src 'self'"), 'live CSP is missing frame or connection restrictions');
assert(rootResponse.headers()['x-content-type-options'] === 'nosniff', 'live nosniff header is missing');

const report = {
  base,
  checkedAt: new Date().toISOString(),
  routes: routeResults,
  externalLinks: externalResults,
  axe: axeResults,
  historicalFindings: historical,
  stableAssetCache,
  firstScreen: {
    bottoms: firstScreen.bottoms,
    badPlatformChangeCopy: firstScreen.badPlatformChangeCopy,
    finalUploadGuidanceCount: firstScreen.finalUploadGuidanceCount
  },
  demo: {
    requestOrigins: [...new Set(demoRequests.map(request => new URL(request.url).origin))],
    requestMethods: [...new Set(demoRequests.map(request => request.method))],
    reset: true,
    exitRestoresReal: true,
    export: true,
    prefixedTtml
  },
  securityHeaders: {
    contentSecurityPolicy: csp,
    noSniff: rootResponse.headers()['x-content-type-options']
  },
  offlineReload: true,
  textResize200: !resizeOverflow,
  failures
};
writeFileSync(join(evidence, 'live-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
await api.dispose();
await browser.close();

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
