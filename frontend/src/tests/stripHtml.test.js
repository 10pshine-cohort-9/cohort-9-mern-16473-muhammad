import { stripHtml } from '../utils/stripHtml';

describe('stripHtml', () => {
  it('removes HTML tags and replaces them with a space', () => {
    expect(stripHtml('<p>Hello</p><p>World</p>')).toBe('Hello World');
  });

  it('decodes common HTML entities', () => {
    expect(stripHtml('Salt &amp; Pepper&nbsp;Shaker')).toBe('Salt & Pepper Shaker');
  });

  it('collapses multiple spaces into one', () => {
    expect(stripHtml('<p>A</p>   <p>B</p>')).toBe('A B');
  });

  it('trims leading and trailing whitespace', () => {
    expect(stripHtml('  <p>Hi</p>  ')).toBe('Hi');
  });

  it('returns an empty string for null or undefined input', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
  });

  it('returns an empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});