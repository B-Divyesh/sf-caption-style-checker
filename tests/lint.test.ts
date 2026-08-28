import { describe, expect, it } from 'vitest';
import { lint, parse, SAMPLE_VTT } from '../src/lint';

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
  it('reads timed TTML paragraphs', () => {
    const result = parse('<tt><body><div><p begin="00:00:01.000" end="00:00:03.000">Hello <span>world</span></p></div></body></tt>');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.cues[0].text).toBe('Hello world');
  });
  it('gives an actionable parsing error for plain text', () => expect(parse('just words')).toHaveProperty('error'));
});

describe('caption checks', () => {
  it('@claim:sample-preflight reports observable sample warnings', () => {
    const result = lint(SAMPLE_VTT, 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) {
      expect(result.findings.some(f => f.code === 'speed')).toBe(true);
      expect(result.findings.some(f => f.code === 'placement')).toBe(true);
      expect(result.findings.some(f => f.code === 'speaker')).toBe(true);
    }
  });
  it('@claim:local-caption-check flags platform-specific markup without a parse error', () => {
    const result = lint('WEBVTT\n\n00:00:00.000 --> 00:00:02.000\n<v Sam><i>Read this</i>', 'youtube');
    expect('error' in result).toBe(false);
    if (!('error' in result)) expect(result.findings.some(f => f.code === 'unsupported-tag')).toBe(true);
  });
});
