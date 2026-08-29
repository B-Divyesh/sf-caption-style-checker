import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release contracts', () => {
  it('gives every declared claim exactly one tagged test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string }>;
    const tests = [readFileSync('tests/app.spec.ts', 'utf8'), readFileSync('tests/lint.test.ts', 'utf8')].join('\n');
    for (const claim of claims) {
      expect(tests.match(new RegExp(`@claim:${claim.id}`, 'g')) || [], claim.id).toHaveLength(1);
    }
  });

  it('routes unknown Azure Static Web Apps paths to a real HTTP 404', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });

  it('ships share metadata and an Apple touch icon from product art', () => {
    const index = readFileSync('index.html', 'utf8');
    const notFound = readFileSync('404.html', 'utf8');
    for (const document of [index, notFound]) {
      expect(document).toContain('caption-checker-social.jpg');
      expect(document).toContain('og:image:width" content="1200"');
      expect(document).toContain('og:image:height" content="630"');
      expect(document).toContain('apple-touch-icon.png');
      expect(document).toContain('twitter:image');
    }
  });

  it('versions caches, removes old versions, and refreshes navigations online', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    expect(worker).toContain("searchParams.get('v')");
    expect(worker).toContain('key !== CACHE');
    expect(worker.indexOf("if (e.request.mode === 'navigate')")).toBeLessThan(worker.indexOf('caches.match(e.request'));
  });
});
