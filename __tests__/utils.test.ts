import { formatNumber } from '../src/utils/formatNumber';
import { formatTime } from '../src/utils/formatTime';
import { isValidEmail, isValidUsername } from '../src/utils/validators';

describe('formatNumber', () => {
  it('returns number as string under 1000', () => {
    expect(formatNumber(999)).toBe('999');
  });
  it('formats thousands as K', () => {
    expect(formatNumber(1200)).toBe('1.2K');
  });
  it('formats millions as M', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });
  it('handles 0', () => {
    expect(formatNumber(0)).toBe('0');
  });
  it('formats exactly 1000 as 1K', () => {
    expect(formatNumber(1000)).toBe('1K');
  });
});

describe('formatTime', () => {
  it('formats seconds under a minute', () => {
    expect(formatTime(45)).toBe('0:45');
  });
  it('formats minutes and seconds', () => {
    expect(formatTime(90)).toBe('1:30');
  });
  it('pads seconds under 10', () => {
    expect(formatTime(65)).toBe('1:05');
  });
});

describe('validators', () => {
  it('validates correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });
  it('validates correct username', () => {
    expect(isValidUsername('user_123')).toBe(true);
  });
  it('rejects username with spaces', () => {
    expect(isValidUsername('user name')).toBe(false);
  });
  it('rejects username shorter than 3 chars', () => {
    expect(isValidUsername('ab')).toBe(false);
  });
  it('rejects username longer than 30 chars', () => {
    expect(isValidUsername('a'.repeat(31))).toBe(false);
  });
});
