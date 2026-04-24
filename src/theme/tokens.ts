export const colors = {
  background: '#FFFFFF',
  screen: '#F3F4F6',
  surface: '#F5F3FF',
  surfaceMuted: '#EDEBF2',
  border: '#EDECF1',
  textPrimary: '#101014',
  textSecondary: '#6B6B72',
  textTertiary: '#9A9AA2',
  accent: '#5B1FB6',
  accentPressed: '#4A19A0',
  accentMuted: '#EADCFF',
  onAccent: '#FFFFFF',
  like: '#EC3A7A',
  likeMuted: '#FDE4EE',
  success: '#34C759',
  danger: '#E53935',
  overlay: 'rgba(0,0,0,0.04)',
  paidBg: '#F5F3FF',
  paidBorder: '#E4DCFB',
  paidIcon: '#5B1FB6',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  title: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h2: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  meta: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
} as const;

export const layout = {
  avatarSm: 32,
  avatarMd: 40,
  iconWrapSm: 44,
  iconWrapLg: 88,
  touchTarget: 36,
  inputMaxHeight: 96,
  coverAspectRatio: 16 / 11,
} as const;

export const iconSize = {
  sm: 18,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const opacity = {
  pressed: 0.6,
  subtle: 0.7,
  disabled: 0.4,
} as const;

export const skeleton = {
  lineSm: 10,
  lineMd: 14,
  lineLg: 18,
} as const;

export const touch = {
  hitSlop: 8,
} as const;
