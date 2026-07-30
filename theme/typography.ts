export const typography = {
  family: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    x2l: 24,
  },
  lineHeight: {
    tight: 18,
    base: 20,
    relaxed: 22,
    spacious: 24,
  },
  letterSpacing: {
    normal: 0,
    overline: 1,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const fmTypography = {
  heroTitle: {
    fontSize: typography.size.x2l,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.normal,
  },
  body: {
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.base,
    fontWeight: typography.weight.regular,
  },
  label: {
    fontSize: 15,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  badge: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
} as const;
