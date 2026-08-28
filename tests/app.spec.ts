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
