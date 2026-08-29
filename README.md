# Caption Style Checker

Check caption files before upload.

Caption Style Checker is for independent video educators and accessibility
reviewers. It reads WebVTT, SRT, and timed TTML in the browser. It reports
reading speed, long lines, speaker labels, styled text, placement cues, and
markup a selected platform may flatten.

Try the isolated sample at `/demo`. It loads a short lesson intro and its
warnings. Sample edits stay in memory and are discarded when real mode starts.

## Run it

```sh
npm install
npm run dev
```

Open the local URL that Vite prints. Use `npm test` for parser and browser
tests. Use `npm run lint` and `npm run typecheck` for static checks. Use
`npm run build` to create the deployable `dist/` directory.

## Privacy and scope

Caption text is processed on-device. Real mode saves only the current caption
text in this browser to survive a refresh. Demo mode does not save it. The app
does not upload files, host video, translate speech, or guarantee changing
platform behavior. See `/privacy` and `/terms` in the app.

## Deploy

Deploy the contents of `dist/` to a static host with SPA navigation fallback.
`public/staticwebapp.config.json` is provided for Azure Static Web Apps.

## License

[MIT](LICENSE)
