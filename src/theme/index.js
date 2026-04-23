export const theme = {
  colors: {
    surface: '#f8f9ff',
    surfaceDim: '#cbdbf5',
    surfaceBright: '#f8f9ff',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#eff4ff',
    surfaceContainer: '#e5eeff',
    surfaceContainerHigh: '#dce9ff',
    surfaceContainerHighest: '#d3e4fe',
    onSurface: '#0b1c30',
    onSurfaceVariant: '#3d4a3d',
    inverseSurface: '#213145',
    inverseOnSurface: '#eaf1ff',
    outline: '#6d7b6c',
    outlineVariant: '#bccbb9',
    surfaceTint: '#006e2f',
    primary: '#006e2f',
    onPrimary: '#ffffff',
    primaryContainer: '#22c55e',
    onPrimaryContainer: '#004b1e',
    inversePrimary: '#4ae176',
    secondary: '#0058be',
    onSecondary: '#ffffff',
    secondaryContainer: '#2170e4',
    onSecondaryContainer: '#fefcff',
    tertiary: '#9d4300',
    onTertiary: '#ffffff',
    tertiaryContainer: '#ff8e4d',
    onTertiaryContainer: '#6d2d00',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
    background: '#f8f9ff',
    onBackground: '#0b1c30',
    
    // Semantic aliases
    success: '#22c55e',
    progress: '#0058be',
    streak: '#9d4300', // Using tertiary for streak orange as per DESIGN.md colors section mentions orange but YAML says tertiary is 9d4300 (reddish-orange)
  },
  typography: {
    displayXl: {
      fontFamily: 'Lexend_700Bold',
      fontSize: 40,
      lineHeight: 48,
      letterSpacing: -0.8, // -0.02em
    },
    headlineLg: {
      fontFamily: 'Lexend_600SemiBold',
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: -0.28, // -0.01em
    },
    headlineMd: {
      fontFamily: 'Lexend_600SemiBold',
      fontSize: 22,
      lineHeight: 28,
    },
    bodyLg: {
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
      lineHeight: 28,
    },
    bodyMd: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodySm: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    labelBold: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.6, // 0.05em
    },
    labelCaps: {
      fontFamily: 'Inter_700Bold',
      fontSize: 11,
      lineHeight: 14,
      textTransform: 'uppercase',
    },
  },
  spacing: {
    unit: 4,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
    xxl: 64,
    gutter: 16,
    margin: 20,
  },
  radius: {
    sm: 4,
    default: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    level1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
    },
    level2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 30,
      elevation: 10,
    },
  }
};
