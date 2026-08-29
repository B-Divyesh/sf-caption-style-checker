export type Format = 'WebVTT' | 'SRT' | 'TTML';
export type Cue = { start: number; end: number; text: string; settings?: string; raw: string; id?: string; number: number };
export type Finding = { level: 'error' | 'warning' | 'note'; code: string; title: string; detail: string; cue?: number };
export type Report = { format: Format; cues: Cue[]; cueCount: number; findings: Finding[]; duration: number; profile: string };

type ParseResult = { format: Format; cues: Cue[]; cueCount: number; findings: Finding[] } | { error: string };
type Profile = { label: string; source: string; reviewed: string; formats: Format[]; settings: boolean; tags: RegExp | null };

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

export const PROFILES: Record<string, Profile> = {
  youtube: {
    label: 'YouTube upload',
    source: 'https://support.google.com/youtube/answer/2734698?hl=en',
    reviewed: '29 August 2026',
    formats: ['WebVTT', 'SRT', 'TTML'],
    settings: true,
    tags: /<(?:v|i|b|u|c(?:\.[^ >]+)?|ruby|rt|lang)[^>]*>/gi
  },
  html: {
    label: 'HTML video track',
    source: 'https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format',
    reviewed: '29 August 2026',
    formats: ['WebVTT'],
    settings: false,
    tags: null
  }
};

function clockTime(value: string): number {
  const match = /^(?:(\d+):)?(\d{2}):(\d{2})(?:[,.](\d+))?$/.exec(value.trim());
  if (!match) return NaN;
  const hours = match[1] === undefined ? 0 : Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const fraction = match[4] ? Number(`0.${match[4]}`) : 0;
  if (minutes > 59 || seconds > 59) return NaN;
  return hours * 3600 + minutes * 60 + seconds + fraction;
}

function ttmlTime(value: string): number {
  const offset = /^(\d+(?:\.\d+)?)(h|m|s|ms)$/.exec(value.trim());
  if (offset) return Number(offset[1]) * ({ h: 3600, m: 60, s: 1, ms: 0.001 }[offset[2]] || 0);
  return clockTime(value);
}

function decodeCharacterReferences(value: string) {
  return value.replace(/&(?:#(x[0-9a-f]+|\d+)|amp|lt|gt|quot|apos);/gi, (reference, numeric?: string) => {
    if (!numeric) return ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }[reference.toLowerCase()] || reference);
    const radix = numeric[0].toLowerCase() === 'x' ? 16 : 10;
    const codePoint = Number.parseInt(numeric.slice(radix === 16 ? 1 : 0), radix);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return reference;
    return String.fromCodePoint(codePoint);
  });
}

function clean(value: string) {
  return decodeCharacterReferences(value.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function blocks(source: string) {
  return source.replace(/\r/g, '').trim().split(/\n\s*\n/).filter(Boolean);
}

function malformed(cue: number, line?: string): Finding {
  return {
    level: 'error',
    code: 'malformed-time',
    title: 'Cue has an invalid timestamp',
    detail: line ? `Fix this timing line: ${line}. Use minutes and seconds from 00 to 59.` : 'Add one timing line with a start, an arrow, and an end time.',
    cue
  };
}

export function detectFormat(source: string): Format | null {
  if (/^\s*WEBVTT(?:\s|$)/i.test(source)) return 'WebVTT';
  if (/<(?:tt|ttml)(?:\s|>)/i.test(source)) return 'TTML';
  if (/^\s*(?:\d+\s*\n)?[^\n]*-->[^\n]*$/m.test(source)) return 'SRT';
  return null;
}

export function parse(source: string): ParseResult {
  const format = detectFormat(source);
  if (!format) return { error: 'This does not look like a WebVTT, SRT, or timed TTML file. Choose a caption file with timed cues.' };

  if (format === 'TTML') {
    const cues: Cue[] = [];
    const findings: Finding[] = [];
    let cueCount = 0;
    for (const match of source.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
      cueCount += 1;
      const attrs = match[1];
      const begin = /\bbegin=["']([^"']+)/i.exec(attrs)?.[1];
      const end = /\bend=["']([^"']+)/i.exec(attrs)?.[1];
      const dur = /\bdur=["']([^"']+)/i.exec(attrs)?.[1];
      const start = begin ? ttmlTime(begin) : NaN;
      const endTime = end ? ttmlTime(end) : NaN;
      const duration = dur ? ttmlTime(dur) : NaN;
      const finish = Number.isNaN(endTime) && !Number.isNaN(start) && !Number.isNaN(duration) ? start + duration : endTime;
      if (Number.isNaN(start) || Number.isNaN(finish)) {
        findings.push(malformed(cueCount, `begin="${begin || ''}" end="${end || ''}" dur="${dur || ''}"`));
        continue;
      }
      const placement = attrs.match(/(?:^|\s)(?:region|tts:(?:textAlign|displayAlign|origin|extent|writingMode))\s*=\s*["'][^"']*["']/gi) || [];
      cues.push({ start, end: finish, text: clean(match[2]), raw: match[0], settings: placement.join(' '), number: cueCount });
    }
    if (!cueCount) return { error: 'No timed <p> captions were found in this TTML file. Use begin with end or dur attributes on each caption.' };
    return { format, cues, cueCount, findings };
  }

  const cues: Cue[] = [];
  const findings: Finding[] = [];
  let cueCount = 0;
  for (const block of blocks(source)) {
    if (format === 'WebVTT' && (/^WEBVTT(?:\s|$)/i.test(block) || /^(?:NOTE|STYLE|REGION)(?:\s|$)/i.test(block))) continue;
    cueCount += 1;
    const lines = block.split('\n');
    const arrow = lines.findIndex(line => line.includes('-->'));
    if (arrow < 0) {
      findings.push(malformed(cueCount));
      continue;
    }
    const timingLine = lines[arrow].trim();
    const match = /^([^\s]+)\s+-->\s+([^\s]+)(?:\s+(.*))?$/.exec(timingLine);
    if (!match) {
      findings.push(malformed(cueCount, timingLine));
      continue;
    }
    const start = clockTime(match[1]);
    const end = clockTime(match[2]);
    const requiredShape = format === 'SRT' ? /^\d+:\d{2}:\d{2}[,.]\d{3}$/ : /^(?:\d+:)?\d{2}:\d{2}[,.]\d{3}$/;
    if (!requiredShape.test(match[1]) || !requiredShape.test(match[2]) || Number.isNaN(start) || Number.isNaN(end)) {
      findings.push(malformed(cueCount, timingLine));
      continue;
    }
    const raw = lines.slice(arrow + 1).join('\n').trim();
    cues.push({ start, end, text: clean(raw), raw, settings: match[3] || '', id: arrow ? lines[0].trim() : undefined, number: cueCount });
  }
  if (!cueCount) return { error: 'No caption cues were found. Add a timing line, for example 00:00:01.000 --> 00:00:03.000.' };
  return { format, cues, cueCount, findings };
}

export function lint(source: string, profile = 'youtube'): Report | { error: string } {
  const parsed = parse(source);
  if ('error' in parsed) return parsed;
  const selected = PROFILES[profile] || PROFILES.youtube;
  const findings: Finding[] = [...parsed.findings];

  if (!selected.formats.includes(parsed.format)) {
    findings.push({ level: 'error', code: 'platform-format', title: `${selected.label} needs WebVTT`, detail: `Convert this ${parsed.format} file to WebVTT before using it in an HTML <track> element.` });
  }

  parsed.cues.forEach(cue => {
    const seconds = cue.end - cue.start;
    const words = cue.text ? cue.text.split(/\s+/).length : 0;
    if (seconds <= 0) findings.push({ level: 'error', code: 'bad-time', title: 'End time is not after start time', detail: 'Set a later end time for this cue.', cue: cue.number });
    if (!cue.text) findings.push({ level: 'error', code: 'empty', title: 'Cue has no caption text', detail: 'Add text or remove this empty timed cue.', cue: cue.number });
    if (seconds > 0) {
      const wpm = words / seconds * 60;
      if (wpm > 180) findings.push({ level: 'warning', code: 'speed', title: `${Math.round(wpm)} words per minute`, detail: 'This cue is above the 180-word-per-minute guidance threshold.', cue: cue.number });
    }
    if (cue.text.length > 84 || cue.raw.split('\n').some(line => clean(line).length > 42)) findings.push({ level: 'warning', code: 'line-length', title: 'Long caption line', detail: 'Split this cue into shorter lines for easier reading.', cue: cue.number });
    if (selected.settings && cue.settings?.trim()) findings.push({ level: 'warning', code: 'placement', title: 'Check placement after YouTube upload', detail: 'This cue uses placement or alignment settings. Preview the uploaded video because YouTube rendering can differ.', cue: cue.number });
    const tags = selected.tags ? cue.raw.match(selected.tags) || [] : [];
    if (tags.length) findings.push({ level: 'warning', code: 'unsupported-tag', title: 'Check markup after YouTube upload', detail: `This cue uses ${[...new Set(tags.map(tag => tag.replace(/<\/?([^ .>]+).*/, '$1')))].join(', ')} markup. Preview the uploaded video to confirm that its meaning remains clear.`, cue: cue.number });
    if (parsed.format === 'WebVTT') {
      const tagNames = [...cue.raw.matchAll(/<\/?([a-z][a-z0-9-]*)(?:[ .][^>]*)?>/gi)].map(match => match[1].toLowerCase());
      const allowed = new Set(['b', 'i', 'u', 'c', 'v', 'ruby', 'rt', 'lang']);
      const unsupported = [...new Set(tagNames.filter(name => !allowed.has(name)))];
      if (unsupported.length) findings.push({ level: 'error', code: 'unsupported-tag', title: 'Unsupported WebVTT tag', detail: `Remove ${unsupported.map(name => `<${name}>`).join(', ')}. It is not supported by ${selected.label}.`, cue: cue.number });
    }
    if (/<(?:i|b|u|c\b|ruby|rt)\b/i.test(cue.raw)) findings.push({ level: 'note', code: 'emphasis', title: 'Styled text found', detail: 'Keep a plain-text alternative if the style carries meaning.', cue: cue.number });
    if (/<v(?:\s|>)/i.test(cue.raw) || /^[A-Z][A-Z .'-]{1,25}:/m.test(cue.text)) findings.push({ level: 'note', code: 'speaker', title: 'Speaker cue found', detail: 'Check that speaker names remain visible after export.', cue: cue.number });
  });
  if (parsed.cues.length && !parsed.cues.some(cue => /<v(?:\s|>)/i.test(cue.raw) || /^[A-Z][A-Z .'-]{1,25}:/m.test(cue.text))) findings.push({ level: 'note', code: 'speaker-missing', title: 'No speaker labels found', detail: 'Add names when more than one voice speaks or identity matters.' });
  const duration = parsed.cues.length ? Math.max(...parsed.cues.map(cue => cue.end)) : 0;
  return { format: parsed.format, cues: parsed.cues, cueCount: parsed.cueCount, findings, duration, profile: selected.label };
}
