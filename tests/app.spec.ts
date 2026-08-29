import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
const F_V5_SEMANTIC_FIXTURES = [
  [fixture('fv5-unsupported-markup.srt'), 'Unsupported SRT tag'],
  [fixture('fv5-styled-text.srt'), 'Check SRT styling after upload'],
  [fixture('fv5-referenced-color.ttml'), 'Check TTML styling after upload'],
  [fixture('fv5-referenced-placement.ttml'), 'Check placement after YouTube upload']
] as const;

test('@claim:sample-preflight loads the isolated sample and visible warnings', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Caption Style Checker');
  await expect(page.getByRole('status')).toContainText('nothing is saved');
  await expect(page.getByRole('heading', { name: 'Check sample captions' })).toBeVisible();
  await expect(page.locator('.finding')).toHaveCount(9);
  await expect(page.getByText('Check placement after YouTube upload').first()).toBeVisible();
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.waitForFunction(() => (window as Window & { __captionShellCached?: boolean }).__captionShellCached === true);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Check sample captions' })).toBeVisible();
});

test('@claim:local-caption-check keeps demo requests on this origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Check captions' }).click();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(url => new URL(url).hostname === '127.0.0.1')).toBeTruthy();
});

test('@claim:free-to-use shows no payment gate', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free to use.')).toBeVisible();
  await expect(page.locator('form, [data-payment], [data-checkout]')).toHaveCount(0);
});

test('@claim:caption-formats visibly checks WebVTT, SRT, and timed TTML', async ({ page }) => {
  await page.goto('/demo');
  const formats = [
    ['WebVTT', 'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello world'],
    ['SRT', '1\n00:00:01,000 --> 00:00:03,000\nHello world'],
    ['TTML', '<tt xmlns="http://www.w3.org/ns/ttml"><body><div><p begin="1s" end="3s">JORDAN: Hello <span>world</span></p></div></body></tt>']
  ] as const;
  for (const [format, source] of formats) {
    await page.getByLabel('Caption text').fill(source);
    await page.getByRole('button', { name: 'Check captions' }).click();
    await expect(page.locator('.report .eyebrow')).toContainText(format);
  }
  await expect(page.getByText('Review placement settings')).toHaveCount(0);
  await expect(page.getByText('Speaker cue found')).toBeVisible();

  for (const [source, finding] of F_V5_SEMANTIC_FIXTURES) {
    await page.getByLabel('Caption text').fill(source);
    await page.getByRole('button', { name: 'Check captions' }).click();
    await expect(page.getByText(finding)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ready to publish' })).toHaveCount(0);
  }
});

test('F-V5-1 never reports ready for unsupported SRT markup or referenced TTML styles', async ({ page }) => {
  await page.goto('/demo');
  for (const [source, finding] of F_V5_SEMANTIC_FIXTURES) {
    await page.getByLabel('Caption text').fill(source);
    await page.getByRole('button', { name: 'Check captions' }).click();
    await expect(page.getByText(finding)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ready to publish' })).toHaveCount(0);
  }
});

test('@claim:report-export downloads the visible findings as text', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export report' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('caption-report.txt');
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  expect(text).toContain('Publishing platform: YouTube upload');
  expect(text).toContain('WARNING cue 1: Check placement after YouTube upload');
});

test('@claim:platform-review-findings applies the selected publishing platform rules', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Platform: YouTube upload')).toBeVisible();
  await expect(page.getByText('Check placement after YouTube upload').first()).toBeVisible();
  await page.getByLabel('Publishing platform').selectOption('html');
  await expect(page.getByText('Platform: HTML video track')).toBeVisible();
  await page.getByLabel('Caption text').fill('1\n00:00:01,000 --> 00:00:03,000\nSRT caption.');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByText('HTML video track needs WebVTT')).toBeVisible();
});

test('@claim:platform-rules-reviewed shows the dated source for each selected platform', async ({ page }) => {
  await page.goto('/demo');
  const note = page.locator('.profile-note');
  await expect(note).toContainText('Rules reviewed 29 August 2026');
  await expect(note.getByRole('link')).toHaveAttribute('href', /support\.google\.com\/youtube/);
  await page.getByLabel('Publishing platform').selectOption('html');
  await expect(note).toContainText('Rules reviewed 29 August 2026');
  await expect(note.getByRole('link')).toHaveAttribute('href', /developer\.mozilla\.org/);
});

test('@claim:caption-check-categories shows every advertised check category', async ({ page }) => {
  await page.goto('/demo');
  for (const finding of ['words per minute', 'Long caption line', 'Styled text found', 'Check placement after YouTube upload', 'Check markup after YouTube upload', 'Speaker cue found']) {
    await expect(page.getByText(finding, { exact: false }).first()).toBeVisible();
  }
});

test('F-V3-1 malformed SRT cues and invalid seconds can never report ready', async ({ page }) => {
  await page.goto('/demo');
  const mixed = `1
00:00:01,000 --> 00:00:03,000
JORDAN: Valid cue.

2
00:00:AA,000 --> 00:00:07,000
MORGAN: This cue is silently malformed.`;
  await page.getByLabel('Caption text').fill(mixed);
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByRole('heading', { name: '1 fix needed' })).toBeVisible();
  await expect(page.getByText('Cue has an invalid timestamp')).toBeVisible();
  await expect(page.getByText('Cue 2', { exact: true })).toBeVisible();
  await expect(page.getByText('Ready to publish')).toHaveCount(0);
  await page.getByLabel('Caption text').fill('1\n00:00:61,000 --> 00:00:63,000\nInvalid seconds.');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByText('Cue has an invalid timestamp')).toBeVisible();
  await expect(page.getByText('Ready to publish')).toHaveCount(0);
});

test('F-V4-1 preserves an unsubmitted pasted caption when the platform changes', async ({ page }) => {
  const source = '1\n00:00:01,000 --> 00:00:03,000\nUNIQUE: edit';
  await page.goto('/demo');
  await page.getByLabel('Caption text').fill(source);
  await page.getByLabel('Publishing platform').selectOption('html');
  await expect(page.getByLabel('Caption text')).toHaveValue(source);
});

test('F-V4-2 reports unsupported WebVTT tags instead of ready to publish', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Caption text').fill('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\n<foo>Meaning</foo>');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByRole('heading', { name: '1 fix needed' })).toBeVisible();
  await expect(page.getByText('Unsupported WebVTT tag')).toBeVisible();
  await expect(page.getByText('Ready to publish')).toHaveCount(0);
});

test('F-V4-3 accepts timed TTML begin plus dur', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Caption text').fill('<tt><body><div><p begin="1s" dur="2s">JORDAN: Duration.</p></div></body></tt>');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.locator('.report .eyebrow')).toContainText('TTML · 1 cue · 3 sec');
  await expect(page.getByText('Cue has an invalid timestamp')).toHaveCount(0);
});

test('F-V4-4 decodes character references in the cue preview', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Caption text').fill('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nJORDAN: Fish &amp; chips &lt;fresh&gt; &#35;1');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.locator('#preview-text')).toHaveText('JORDAN: Fish & chips <fresh> #1');
});

test('@claim:accessible-preview-styles compares three readable cue treatments', async ({ page }) => {
  await page.goto('/demo');
  const styles = [
    ['White on black', 'rgb(255, 255, 255)', 'rgb(1, 6, 7)'],
    ['Black on white', 'rgb(7, 21, 29)', 'rgb(255, 255, 255)'],
    ['Yellow on black', 'rgb(255, 223, 127)', 'rgb(1, 6, 7)']
  ] as const;
  for (const [name, color, background] of styles) {
    await page.getByLabel(name).check();
    const computed = await page.locator('#preview-text').evaluate(element => {
      const value = getComputedStyle(element);
      return [value.color, value.backgroundColor];
    });
    expect(computed).toEqual([color, background]);
  }
});

test('F-V3-5 keyboard platform changes and checks retain a useful focus position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByLabel('Publishing platform').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Publishing platform')).toBeFocused();
  await expect(page.getByLabel('Publishing platform')).toHaveValue('html');
  await page.keyboard.press('ArrowUp');
  await expect(page.getByLabel('Publishing platform')).toBeFocused();
  await expect(page.getByLabel('Publishing platform')).toHaveValue('youtube');
  await page.getByRole('button', { name: 'Check captions' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#report-title')).toBeFocused();
});

test('@claim:reading-speed-threshold flags only cues above 180 words per minute', async ({ page }) => {
  await page.goto('/demo');
  const atThreshold = '1\n00:00:00,000 --> 00:00:10,000\n' + Array(30).fill('word').join(' ');
  await page.getByLabel('Caption text').fill(atThreshold);
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByText('words per minute', { exact: false })).toHaveCount(0);
  const aboveThreshold = '1\n00:00:00,000 --> 00:00:10,000\n' + Array(31).fill('word').join(' ');
  await page.getByLabel('Caption text').fill(aboveThreshold);
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByText('186 words per minute')).toBeVisible();
  await expect(page.getByText('This cue is above the 180-word-per-minute guidance threshold.')).toBeVisible();
});

test('@claim:real-session-refresh keeps real caption text after a reload', async ({ page }) => {
  const realSource = '1\n00:00:10,000 --> 00:00:12,000\nSaved real caption.';
  await page.goto('/');
  await page.getByLabel('Caption text').fill(realSource);
  await page.reload();
  await expect(page.getByLabel('Caption text')).toHaveValue(realSource);
});

test('@claim:demo-memory-isolation never reads or writes real caption storage', async ({ page }) => {
  const realSource = '1\n00:00:10,000 --> 00:00:12,000\nMy saved real caption.';
  await page.addInitScript(value => {
    localStorage.setItem('caption-source', value);
    const original = Storage.prototype.getItem;
    (window as Window & { __storageReads?: string[] }).__storageReads = [];
    Storage.prototype.getItem = function (key: string) {
      (window as Window & { __storageReads?: string[] }).__storageReads?.push(key);
      return original.call(this, key);
    };
  }, realSource);
  await page.goto('/demo');
  expect(await page.evaluate(() => (window as Window & { __storageReads?: string[] }).__storageReads)).not.toContain('caption-source');
  const demoEdit = '1\n00:00:01,000 --> 00:00:03,000\nEdited only in demo.';
  await page.getByLabel('Caption text').fill(demoEdit);
  await page.getByRole('button', { name: 'Check captions' }).click();
  expect(await page.evaluate(() => localStorage.getItem('caption-source'))).toBe(realSource);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByLabel('Caption text')).toHaveValue(realSource);
});

test('demo edits persist until reset and never replace real data', async ({ page }) => {
  const realSource = '1\n00:00:10,000 --> 00:00:12,000\nMy saved real caption.';
  await page.addInitScript(value => {
    localStorage.setItem('caption-source', value);
    const original = Storage.prototype.getItem;
    (window as Window & { __storageReads?: string[] }).__storageReads = [];
    Storage.prototype.getItem = function (key: string) {
      (window as Window & { __storageReads?: string[] }).__storageReads?.push(key);
      return original.call(this, key);
    };
  }, realSource);
  await page.goto('/demo');
  expect(await page.evaluate(() => (window as Window & { __storageReads?: string[] }).__storageReads)).not.toContain('caption-source');
  const demoEdit = '1\n00:00:01,000 --> 00:00:03,000\nEdited only in demo.';
  await page.getByLabel('Caption text').fill(demoEdit);
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByLabel('Caption text')).toHaveValue(demoEdit);
  await expect(page.locator('.report .eyebrow')).toContainText('SRT');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Caption text')).toContainText('WEBVTT');
  await page.getByLabel('Caption text').fill(demoEdit);
  await page.getByRole('button', { name: 'Check captions' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByLabel('Caption text')).toHaveValue(realSource);
  expect(await page.evaluate(() => (window as Window & { __storageReads?: string[] }).__storageReads)).toContain('caption-source');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('the documented demo query opens the isolated sample directly', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Caption Style Checker');
  await expect(page.getByRole('heading', { name: 'Check sample captions' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('nothing is saved');
});

test('clear and parse errors remove the stale cue preview', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Compare accessible styles' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByRole('heading', { name: 'Compare accessible styles' })).toHaveCount(0);
  await page.getByLabel('Caption text').fill('not a timed caption file');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByRole('heading', { name: 'We could not read that caption file' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Compare accessible styles' })).toHaveCount(0);
});

test('keyboard focus is visible on file selection and moves to route headings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (let press = 0; press < 14; press += 1) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.id === 'file')) break;
  }
  await expect(page.locator('#file')).toBeFocused();
  const outline = await page.locator('#dropzone').evaluate(element => getComputedStyle(element).outlineStyle);
  expect(outline).toBe('solid');
  await page.getByRole('link', { name: 'Privacy' }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeFocused();
});

test('an online navigation ignores a stale cached shell', async ({ page }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.evaluate(async () => {
    const cache = await caches.open('caption-check-stale-regression');
    await cache.put('/demo', new Response('<h1>Stale shell</h1>', { headers: { 'Content-Type': 'text/html' } }));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Check sample captions' })).toBeVisible();
  await expect(page.getByText('Stale shell')).toHaveCount(0);
});

test('unknown routes render the product 404 page', async ({ page }) => {
  await page.goto('/not-a-real-page');
  await expect(page).toHaveTitle('Page not found — Caption Style Checker');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
