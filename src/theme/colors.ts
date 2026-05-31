export const colors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  primary: '#FE2C55',
  secondary: '#25F4EE',
  white: '#FFFFFF',
  gray: '#8E8E93',
  grayLight: '#48484A',
  overlay: 'rgba(0,0,0,0.5)',
  gradientBottom: ['transparent', 'rgba(0,0,0,0.8)'] as string[],
  verified: '#20D5EC',
} as const;

export type Colors = typeof colors;
