import { defineConfig } from 'vite';

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(process.env.GITHUB_SHA || process.env.BUILD_BUILDID || `${Date.now()}`) },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: { input: { index: 'index.html', '404': '404.html' } }
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] }
});
