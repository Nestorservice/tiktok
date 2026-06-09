import { colors, typography, spacing } from '../src/theme';

describe('theme', () => {
  it('colors has primary TikTok red', () => {
    expect(colors.primary).toBe('#FE2C55');
  });

  it('colors has secondary TikTok cyan', () => {
    expect(colors.secondary).toBe('#25F4EE');
  });

  it('colors background is black', () => {
    expect(colors.background).toBe('#000000');
  });

  it('typography has all font weights', () => {
    expect(typography.bold).toBe('700');
    expect(typography.semibold).toBe('600');
    expect(typography.medium).toBe('500');
    expect(typography.regular).toBe('400');
  });

  it('spacing values are positive numbers', () => {
    Object.values(spacing).forEach(v => expect(v).toBeGreaterThan(0));
  });
});
