# Caption Style Checker

Check caption files before upload.

Caption Style Checker is for independent video educators and accessibility
reviewers. It reads WebVTT, SRT, and timed TTML in this browser. It checks fast
cues, long lines, styled text, placement settings, markup, and speaker cues.

Try the isolated sample at `/demo`. It loads a short lesson intro and shows its
warnings. Sample edits stay only in memory and are discarded when real mode
starts.

## Run it

```sh
npm install
npm run dev
```

Open the local URL that Vite prints. Use `npm test` for parser and browser
tests. Use `npm run lint` and `npm run typecheck` to check TypeScript. Use
`npm run build` to create the `dist/` directory for deployment.

## Privacy and scope

Caption text stays in this browser. Real mode saves the current caption text in
this browser for refresh. Demo mode keeps its sample text only in memory. See
`/privacy` and `/terms` in the app.

## Deploy

Deploy `dist/` to a host that serves the app at `/demo`, `/privacy`, and
`/terms`. `public/staticwebapp.config.json` is provided for Azure Static Web
Apps.

## License

[MIT](LICENSE)
