import { expect, test } from '@playwright/test';

test('@claim:sample-preflight loads the isolated sample and visible warnings', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Caption Style Checker');
  await expect(page.getByRole('status')).toContainText('nothing is saved');
  await expect(page.getByRole('heading', { name: 'Check sample captions' })).toBeVisible();
  await expect(page.locator('.finding')).toHaveCount(9);
  await expect(page.getByText('Placement may be lost').first()).toBeVisible();
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
    ['TTML', '<tt><body><div><p begin="00:00:01.000" end="00:00:03.000">Hello <span>world</span></p></div></body></tt>']
  ] as const;
  for (const [format, source] of formats) {
    await page.getByLabel('Caption text').fill(source);
    await page.getByRole('button', { name: 'Check captions' }).click();
    await expect(page.locator('.report .eyebrow')).toContainText(format);
  }
  await expect(page.getByText('Placement may be lost')).toHaveCount(0);
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
  expect(text).toContain('Profile: YouTube basic captions');
  expect(text).toContain('WARNING cue 1: Placement may be lost');
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
  await expect(page.getByRole('heading', { name: 'Read it in context' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByRole('heading', { name: 'Read it in context' })).toHaveCount(0);
  await page.getByLabel('Caption text').fill('not a timed caption file');
  await page.getByRole('button', { name: 'Check captions' }).click();
  await expect(page.getByRole('heading', { name: 'We could not read that caption file' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Read it in context' })).toHaveCount(0);
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
  await expect(page).toHaveTitle('Not found — Caption Style Checker');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
