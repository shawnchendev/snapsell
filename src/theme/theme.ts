import { createTheme } from '@shopify/restyle';

export const theme = createTheme({
  colors: {
    background: '#F2F4F8',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#5E6C84',
    brand: '#0052CC',
    brandDark: '#003F99',
    danger: '#FF0000',
    border: '#DCE3EF',
    chipBlueBg: '#DEEBFF',
    chipBlueText: '#0052CC',
    chipPinkBg: '#FFEBE6',
    chipPinkText: '#BF2600',
    warmBg: '#FFF4DD',
    warmBorder: '#F6C04E',
    warmText: '#8A5A00',
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
