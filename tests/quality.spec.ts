import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  test(`accessibility and layout smoke test at ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto('/demo');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(violation => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('mobile controls have usable touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const undersized = await page.locator('a, button, select, textarea, label.drop').evaluateAll(elements => elements.flatMap(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return [];
    return rect.width < 44 || rect.height < 44 ? [`${element.tagName}:${(element.textContent || '').trim().slice(0, 30)}:${rect.width}x${rect.height}`] : [];
  }));
  expect(undersized).toEqual([]);
});

test('F-5-2 the global skip link names and focuses each route main', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-real-page']) {
    await page.goto(route);
    const skip = page.getByRole('link', { name: 'Skip to main content', exact: true });
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  }
});

test('mobile first screen keeps the sample outcome beside its primary action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const action = page.getByRole('button', { name: 'Try it with sample data' });
  const outcome = page.getByText('Loads a sample file and shows its warnings.');
  await expect(action).toBeVisible();
  await expect(outcome).toBeVisible();
  expect((await action.boundingBox())!.y).toBeLessThan(844);
  expect((await outcome.boundingBox())!.y + (await outcome.boundingBox())!.height).toBeLessThanOrEqual(844);
});

test('reduced-motion mode removes visible report movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  const duration = await page.locator('.report').evaluate(element => parseFloat(getComputedStyle(element).animationDuration));
  expect(duration).toBeLessThanOrEqual(0.001);
});

test('every public route has one named page heading and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/demo', '/privacy', '/terms', '/not-a-real-page']) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).not.toBeEmpty();
  }
  expect(errors).toEqual([]);
});
