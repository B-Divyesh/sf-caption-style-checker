export type Format = 'WebVTT' | 'SRT' | 'TTML';
export type Cue = { start: number; end: number; text: string; settings?: string; raw: string; id?: string };
export type Finding = { level: 'error' | 'warning' | 'note'; code: string; title: string; detail: string; cue?: number };
export type Report = { format: Format; cues: Cue[]; findings: Finding[]; duration: number; profile: string };

export const SAMPLE_VTT = `WEBVTT

1
00:00:00.000 --> 00:00:02.000 line:90% position:50%
<v Maya><i>Welcome</i> to the field lesson.

2
00:00:02.100 --> 00:00:04.000
This sentence is deliberately far too dense for its short display time, so a viewer cannot read it comfortably.

3
00:00:04.200 --> 00:00:06.000 align:start
<b>Important:</b> check the caption cues.`;

function time(value: string): number {
  const p = value.trim().replace(',', '.').split(':').map(Number);
  if (p.some(Number.isNaN) || p.length < 2 || p.length > 3) return NaN;
  return (p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]);
}
function clean(s: string) { return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function blocks(source: string) { return source.replace(/\r/g, '').trim().split(/\n\s*\n/).filter(Boolean); }

export function detectFormat(source: string): Format | null {
  if (/^\s*WEBVTT/i.test(source)) return 'WebVTT';
  if (/<(?:tt|ttml)(?:\s|>)/i.test(source)) return 'TTML';
  if (/\d{1,2}:\d{2}:\d{2}[,.]\d{3}\s+-->\s+\d{1,2}:\d{2}:\d{2}[,.]\d{3}/.test(source)) return 'SRT';
  return null;
}
export function parse(source: string): { format: Format; cues: Cue[] } | { error: string } {
  const format = detectFormat(source);
  if (!format) return { error: 'This does not look like a WebVTT, SRT, or TTML file. Choose a caption file with timed cues.' };
  if (format === 'TTML') {
    const cues: Cue[] = [];
    for (const m of source.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
      const attrs = m[1], begin = /\bbegin=["']([^"']+)/i.exec(attrs)?.[1], end = /\bend=["']([^"']+)/i.exec(attrs)?.[1];
      const start = begin ? time(begin) : NaN, finish = end ? time(end) : NaN;
      if (!Number.isNaN(start) && !Number.isNaN(finish)) cues.push({ start, end: finish, text: clean(m[2]), raw: m[0], settings: attrs });
    }
    return cues.length ? { format, cues } : { error: 'No timed <p> captions were found in this TTML file. Use begin and end attributes on each caption.' };
  }
  const cues: Cue[] = [];
  for (const block of blocks(source)) {
    if (format === 'WebVTT' && /^WEBVTT/i.test(block)) continue;
    const lines = block.split('\n');
    const arrow = lines.findIndex(x => x.includes('-->'));
    if (arrow < 0) continue;
    const match = /^\s*([^\s]+)\s+-->\s+([^\s]+)(?:\s+(.*))?$/.exec(lines[arrow]);
    if (!match) continue;
    const start = time(match[1]), end = time(match[2]);
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    const raw = lines.slice(arrow + 1).join('\n').trim();
    cues.push({ start, end, text: clean(raw), raw, settings: match[3] || '', id: arrow ? lines[0].trim() : undefined });
  }
  return cues.length ? { format, cues } : { error: 'No readable timed cues were found. Check each time line uses an arrow, for example 00:00:01.000 --> 00:00:03.000.' };
}

const profiles: Record<string, { label: string; tags: RegExp; settings: boolean }> = {
  youtube: { label: 'YouTube basic captions', tags: /<(?:v|i|b|u|c(?:\.[^ >]+)?|ruby|rt|lang)[^>]*>/gi, settings: true },
  html5: { label: 'WebVTT player', tags: /<(?:ruby|rt|lang)[^>]*>/gi, settings: false },
  plain: { label: 'Plain-text export', tags: /<[^>]+>/g, settings: true }
};
export function lint(source: string, profile = 'youtube'): Report | { error: string } {
  const parsed = parse(source);
  if ('error' in parsed) return parsed;
  const p = profiles[profile] || profiles.youtube, findings: Finding[] = [];
  parsed.cues.forEach((cue, index) => {
    const n = index + 1, seconds = cue.end - cue.start, words = cue.text ? cue.text.split(/\s+/).length : 0, wpm = seconds > 0 ? words / seconds * 60 : Infinity;
    if (cue.end <= cue.start) findings.push({ level: 'error', code: 'bad-time', title: 'End time is not after start time', detail: 'Set a later end time for this cue.', cue: n });
    if (!cue.text) findings.push({ level: 'error', code: 'empty', title: 'Cue has no caption text', detail: 'Add text or remove this empty timed cue.', cue: n });
    if (wpm > 180) findings.push({ level: 'warning', code: 'speed', title: `${Math.round(wpm)} words per minute`, detail: 'Aim for 180 words per minute or less so viewers can read it.', cue: n });
    if (cue.text.length > 84 || cue.raw.split('\n').some(l => clean(l).length > 42)) findings.push({ level: 'warning', code: 'line-length', title: 'Long caption line', detail: 'Split this cue into shorter lines for easier reading.', cue: n });
    if (p.settings && cue.settings?.trim()) findings.push({ level: 'warning', code: 'placement', title: 'Placement may be lost', detail: `${p.label} can flatten cue placement or alignment settings.`, cue: n });
    const tags = cue.raw.match(p.tags) || [];
    if (tags.length) findings.push({ level: 'warning', code: 'unsupported-tag', title: 'Caption meaning may be lost', detail: `${p.label} may remove ${[...new Set(tags.map(x => x.replace(/<\/?([^ .>]+).*/, '$1')))].join(', ')} markup.`, cue: n });
    if (/<(?:i|b|u|c\b|ruby|rt)\b/i.test(cue.raw)) findings.push({ level: 'note', code: 'emphasis', title: 'Styled text found', detail: 'Keep a plain-text alternative if the style carries meaning.', cue: n });
    if (/<v(?:\s|>)/i.test(cue.raw)) findings.push({ level: 'note', code: 'speaker', title: 'Speaker cue found', detail: 'Check that speaker names remain visible after export.', cue: n });
  });
  if (!parsed.cues.some(c => /<v(?:\s|>)|^[A-Z][A-Za-z .'-]{1,25}:/m.test(c.raw))) findings.push({ level: 'note', code: 'speaker-missing', title: 'No speaker labels found', detail: 'Add names when more than one voice speaks or identity matters.' });
  const duration = Math.max(...parsed.cues.map(c => c.end));
  return { format: parsed.format, cues: parsed.cues, findings, duration, profile: p.label };
}
