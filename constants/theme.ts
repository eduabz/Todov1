import { Platform } from 'react-native';

export type AppTheme = {
  // Backgrounds
  bg: string;
  card: string;
  cardHighlight: string;
  // Borders
  cardBorder: string;
  cardBorderAccent: string;
  divider: string;
  inputBorder: string;
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  // Inputs
  inputBg: string;
  // Accent (indigo)
  accent: string;
  accentDark: string;
  accentLight: string;
  accentMid: string;
  // Semantic
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  // Misc
  skeleton: string;
  tabBar: string;
  tabBarBorder: string;
};

export const LightTheme: AppTheme = {
  bg: '#F1F5F9',
  card: '#FFFFFF',
  cardHighlight: '#F8FAFC',
  cardBorder: '#EEF2FF',
  cardBorderAccent: '#C7D2FE',
  divider: '#F1F5F9',
  inputBorder: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textPlaceholder: '#CBD5E1',
  inputBg: '#FAFAFA',
  accent: '#6366F1',
  accentDark: '#4F46E5',
  accentLight: '#EEF2FF',
  accentMid: '#C7D2FE',
  success: '#10B981',
  successLight: '#D1FAE5',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  skeleton: '#C7D2FE',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export const DarkTheme: AppTheme = {
  bg: '#0F172A',
  card: '#1E293B',
  cardHighlight: '#0F172A',
  cardBorder: '#334155',
  cardBorderAccent: '#4338CA',
  divider: '#1E293B',
  inputBorder: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textPlaceholder: '#475569',
  inputBg: '#0F172A',
  accent: '#818CF8',
  accentDark: '#6366F1',
  accentLight: '#1E1B4B',
  accentMid: '#3730A3',
  success: '#34D399',
  successLight: '#064E3B',
  danger: '#F87171',
  dangerLight: '#450A0A',
  warning: '#FCD34D',
  warningLight: '#78350F',
  info: '#60A5FA',
  infoLight: '#1E3A5F',
  skeleton: '#334155',
  tabBar: '#1E293B',
  tabBarBorder: '#334155',
};

// Legacy — kept for backward compat
export const Colors = {
  light: {
    text: LightTheme.text,
    textSecondary: LightTheme.textSecondary,
    textMuted: LightTheme.textMuted,
    background: LightTheme.bg,
    surface: LightTheme.card,
    surfaceSecondary: LightTheme.cardHighlight,
    border: LightTheme.inputBorder,
    tint: LightTheme.accent,
    icon: LightTheme.textSecondary,
    tabIconDefault: LightTheme.textMuted,
    tabIconSelected: LightTheme.accent,
    tabBar: LightTheme.tabBar,
    tabBarBorder: LightTheme.tabBarBorder,
  },
  dark: {
    text: DarkTheme.text,
    textSecondary: DarkTheme.textSecondary,
    textMuted: DarkTheme.textMuted,
    background: DarkTheme.bg,
    surface: DarkTheme.card,
    surfaceSecondary: DarkTheme.cardHighlight,
    border: DarkTheme.inputBorder,
    tint: DarkTheme.accent,
    icon: DarkTheme.textSecondary,
    tabIconDefault: DarkTheme.textMuted,
    tabIconSelected: DarkTheme.accent,
    tabBar: DarkTheme.tabBar,
    tabBarBorder: DarkTheme.tabBarBorder,
  },
};

export const Palette = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#EEF2FF',
  success: '#10B981',
  successLight: '#D1FAE5',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
