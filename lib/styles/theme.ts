import { designTokens } from './tokens';

export const theme = {
  colors: designTokens.colors,
  typography: designTokens.typography,
  spacing: designTokens.spacing,
  radius: designTokens.radius,
  shadows: designTokens.shadows,
  motion: designTokens.motion,
};

export const themeClasses = {
  surface: 'bg-[#181A20] text-[#F4F5F7]',
  surfaceMuted: 'bg-[#0D0E12] text-[#9498A6]',
  accent: 'bg-[#FF2A55] text-white',
  accentSoft: 'bg-[#FFD000] text-[#0D0E12]',
  success: 'bg-[#00E676] text-[#0D0E12]',
  warning: 'bg-[#FF9100] text-[#0D0E12]',
  error: 'bg-[#FF5252] text-white',
};
