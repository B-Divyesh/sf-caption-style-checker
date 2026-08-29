import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { lint, parse, SAMPLE_VTT } from '../src/lint';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

describe('caption parser', () => {
  it('reads WebVTT cues and settings', () => {
    const result = parse(SAMPLE_VTT);
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.cues).toHaveLength(3);
  });
  it('reads SRT cues', () => {
    const result = parse('1\n00:00:00,000 --> 00:00:02,000\nHello there.');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.format).toBe('SRT');
  });
  it('reads timed TTML paragraphs without treating timing as placement', () => {
    const result = parse('<tt><body><div><p begin="00:00:01.000" end="00:00:03.000">Hello <span>world</span></p></div></body></tt>');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cues[0].text).toBe('Hello world');
      expect(result.cues[0].settings).toBe('');
    }
  });
  it('F-V3-1 reports a malformed cue beside a valid SRT cue', () => {
    const source = `1
00:00:01,000 --> 00:00:03,000
JORDAN: Valid cue.

2
00:00:AA,000 --> 00:00:07,000
MORGAN: This cue is malformed.`;
    const result = lint(source);
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cueCount).toBe(2);
      expect(result.cues).toHaveLength(1);
      expect(result.findings).toContainEqual(expect.objectContaining({ level: 'error', code: 'malformed-time', cue: 2 }));
    }
  });
  it('F-V3-1 rejects invalid SRT minute and second fields', () => {
    const result = lint('1\n00:00:61,000 --> 00:00:63,000\nInvalid seconds.');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cues).toHaveLength(0);
      expect(result.findings).toContainEqual(expect.objectContaining({ level: 'error', code: 'malformed-time', cue: 1 }));
    }
  });
  it('F-V3-3 reads TTML offset times and visible speaker labels', () => {
    const result = lint('<tt xmlns="http://www.w3.org/ns/ttml"><body><div><p begin="1s" end="3s">JORDAN: Hello world</p></div></body></tt>');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cues[0]).toMatchObject({ start: 1, end: 3, text: 'JORDAN: Hello world' });
      expect(result.findings).toContainEqual(expect.objectContaining({ code: 'speaker', cue: 1 }));
      expect(result.findings.some(finding => finding.code === 'speaker-missing')).toBe(false);
    }
  });
  it('F-V4-3 accepts a TTML begin plus dur timestamp', () => {
    const result = lint('<tt><body><div><p begin="1s" dur="2s">JORDAN: Duration.</p></div></body></tt>');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.cues[0]).toMatchObject({ start: 1, end: 3, text: 'JORDAN: Duration.' });
      expect(result.findings.some(finding => finding.code === 'malformed-time')).toBe(false);
    }
  });
  it('F-V4-4 decodes named and numeric character references in cue text', () => {
    const result = parse('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nFish &amp; chips &lt;fresh&gt; &#35;1 &#x1F41F;');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.cues[0].text).toBe('Fish & chips <fresh> #1 🐟');
  });
  it('gives an actionable parsing error for plain text', () => expect(parse('just words')).toHaveProperty('error'));
});

describe('caption checks', () => {
  it('reports observable sample warnings', () => {
    const result = lint(SAMPLE_VTT, 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.findings.some(f => f.code === 'speed')).toBe(true);
      expect(result.findings.some(f => f.code === 'placement')).toBe(true);
      expect(result.findings.some(f => f.code === 'speaker')).toBe(true);
    }
  });
  it('flags platform-specific markup without a parse error', () => {
    const result = lint('WEBVTT\n\n00:00:00.000 --> 00:00:02.000\n<v Sam><i>Read this</i>', 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings.some(f => f.code === 'unsupported-tag')).toBe(true);
  });
  it('F-V4-2 rejects unsupported WebVTT tags for every platform profile', () => {
    const source = 'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\n<foo>Meaning</foo>';
    for (const profile of ['youtube', 'html']) {
      const result = lint(source, profile);
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.findings).toContainEqual(expect.objectContaining({ level: 'error', code: 'unsupported-tag', title: 'Unsupported WebVTT tag', cue: 1 }));
      }
    }
  });
  it('F-V5-1 reports unsupported SRT markup instead of stripping it', () => {
    const result = lint(fixture('fv5-unsupported-markup.srt'));
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings).toContainEqual(expect.objectContaining({ level: 'error', code: 'unsupported-tag', title: 'Unsupported SRT tag', cue: 1 }));
  });
  it('F-V5-1 reports SRT font styling instead of stripping it', () => {
    const result = lint(fixture('fv5-styled-text.srt'));
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings).toContainEqual(expect.objectContaining({ level: 'warning', code: 'style', title: 'Check SRT styling after upload', cue: 1 }));
  });
  it('F-V5-1 resolves TTML color styling referenced by a span', () => {
    const result = lint(fixture('fv5-referenced-color.ttml'));
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings).toContainEqual(expect.objectContaining({ level: 'warning', code: 'style', title: 'Check TTML styling after upload', cue: 1 }));
  });
  it('F-V5-1 resolves TTML placement inherited through a style reference', () => {
    const result = lint(fixture('fv5-referenced-placement.ttml'));
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings).toContainEqual(expect.objectContaining({ level: 'warning', code: 'placement', cue: 1 }));
  });
  it('resolves chained TTML style references and reports unsupported inline tags', () => {
    const source = '<tt xmlns:tts="urn:ttml:styling"><head><styling><style xml:id="base" tts:color="yellow"/><style xml:id="placed" style="base" tts:textAlign="center"/></styling></head><body><p begin="1s" end="3s" style="placed"><foo>Meaning</foo></p></body></tt>';
    const result = lint(source);
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.findings).toContainEqual(expect.objectContaining({ code: 'style' }));
      expect(result.findings).toContainEqual(expect.objectContaining({ code: 'placement' }));
      expect(result.findings).toContainEqual(expect.objectContaining({ level: 'error', title: 'Unsupported TTML tag' }));
    }
  });
  it('does not report placement for TTML timing attributes alone', () => {
    const result = lint('<tt><body><div><p begin="00:00:01.000" end="00:00:03.000">Hello world</p></div></body></tt>', 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings.some(f => f.code === 'placement')).toBe(false);
  });
  it('does not guess that an unrelated TTML style reference controls placement', () => {
    const result = lint('<tt><body><div><p begin="00:00:01.000" end="00:00:03.000" style="yellowText">Hello world</p></div></body></tt>', 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings.some(f => f.code === 'placement')).toBe(false);
  });
  it('still reports actual TTML placement attributes', () => {
    const result = lint('<tt xmlns:tts="urn:ttml:styling"><body><div><p begin="00:00:01.000" end="00:00:03.000" tts:textAlign="center">Hello world</p></div></body></tt>', 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings.some(f => f.code === 'placement')).toBe(true);
  });
  it('F-V3-2 applies the selected publishing platform format rules', () => {
    const source = '1\n00:00:00,000 --> 00:00:02,000\nHello there.';
    const youtube = lint(source, 'youtube');
    const html = lint(source, 'html');
    expect('error' in youtube).toBe(false);
    expect('error' in html).toBe(false);
    if (!('error' in youtube) && !('error' in html)) {
      expect(youtube.profile).toBe('YouTube upload');
      expect(youtube.findings.some(finding => finding.code === 'platform-format')).toBe(false);
      expect(html.profile).toBe('HTML video track');
      expect(html.findings).toContainEqual(expect.objectContaining({ level: 'error', code: 'platform-format' }));
    }
  });
  it('F-V3-6 does not calculate reading speed for reversed timing', () => {
    const result = lint('1\n00:00:05,000 --> 00:00:03,000\nBackwards timing.');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.findings).toContainEqual(expect.objectContaining({ code: 'bad-time' }));
      expect(result.findings.some(finding => finding.code === 'speed' || finding.title.includes('Infinity'))).toBe(false);
    }
  });
});
