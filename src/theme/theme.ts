import { createTheme } from '@shopify/restyle';
import { colors } from './colors';

export const theme = createTheme({
  colors: {
    background: colors.ui.canvas,
    card: colors.ui.surface,
    textPrimary: colors.ui.textPrimary,
    textSecondary: colors.ui.textSecondary,
    onPrimary: colors.ui.onPrimary,
    brand: colors.ui.secondary,
    brandDark: colors.ui.primary,
    danger: colors.status.dangerText,
    border: colors.ui.border,
    chipBlueBg: colors.status.infoBg,
    chipBlueText: colors.status.infoText,
    chipPinkBg: colors.status.errorBg,
    chipPinkText: colors.status.errorText,
    warmBg: colors.status.successBg,
    warmBorder: colors.status.successBorder,
    warmText: colors.status.successText,
  },
  spacing: {
    none: 0,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadii: {
    none: 0,
    s: 6,
    m: 10,
    l: 13,
    xl: 20,
    pill: 999,
  },
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 14,
    },
    title: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '700',
      color: 'textPrimary',
    },
    meta: {
      fontSize: 10,
      fontWeight: '600',
      color: 'textSecondary',
    },
    badge: {
      fontSize: 9,
      fontWeight: '700',
    },
    price: {
      fontSize: 21,
      fontWeight: '900',
      color: 'danger',
    },
  },
});

export type Theme = typeof theme;
