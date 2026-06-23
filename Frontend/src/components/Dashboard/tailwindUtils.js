/**
 * Tailwind CSS Utility Classes for Investor Dashboard
 * Common reusable class patterns for the dashboard components
 */

// Glassmorphism Cards
export const cardClasses = {
  dark: 'bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-blue-500/5 border border-blue-500/20 shadow-xl shadow-blue-900/20 backdrop-blur-xl',
  light: 'bg-gradient-to-br from-white/50 via-blue-50/30 to-white/30 border border-blue-200/30 shadow-lg backdrop-blur-xl',
};

// Text Colors
export const textClasses = {
  dark: {
    primary: 'text-white',
    secondary: 'text-gray-100',
    tertiary: 'text-gray-400',
    muted: 'text-gray-500',
  },
  light: {
    primary: 'text-slate-900',
    secondary: 'text-slate-700',
    tertiary: 'text-slate-600',
    muted: 'text-slate-400',
  },
};

// Background Colors
export const bgClasses = {
  dark: {
    gradient: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
    overlay: 'bg-slate-900/40',
    hover: 'hover:bg-blue-500/10',
  },
  light: {
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
    overlay: 'bg-white/40',
    hover: 'hover:bg-blue-50',
  },
};

// Borders
export const borderClasses = {
  dark: {
    primary: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50',
    active: 'border-blue-500/50',
  },
  light: {
    primary: 'border-blue-200/30',
    hover: 'hover:border-blue-300',
    active: 'border-blue-300',
  },
};

// Hover Effects
export const hoverClasses = {
  scale: 'hover:scale-105 transition-transform duration-300',
  shadow: 'hover:shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300',
  glow: 'hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300',
  lift: 'hover:translate-y-[-2px] transition-transform duration-300',
};

// Button Styles
export const buttonClasses = {
  dark: 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-all duration-300',
  light: 'bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all duration-300',
  active: 'bg-blue-500/40 text-blue-200',
};

// Icons
export const iconClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// Gradients
export const gradientClasses = {
  primary: 'from-blue-500 to-cyan-600',
  success: 'from-green-500 to-emerald-600',
  warning: 'from-yellow-500 to-orange-600',
  error: 'from-red-500 to-pink-600',
  purple: 'from-purple-500 to-pink-600',
  indigo: 'from-indigo-500 to-blue-600',
};

// Animations
export const animationClasses = {
  fade: 'transition-opacity duration-300',
  slideIn: 'transition-transform duration-300',
  slideUp: 'transition-all duration-300 hover:translate-y-[-4px]',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
};

// Spacing
export const spacingClasses = {
  section: 'px-8 py-6',
  card: 'p-6',
  input: 'px-4 py-3',
  button: 'px-4 py-2',
};

// Rounded Corners
export const roundedClasses = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

// Utility Functions
export const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getCardClass = (isDark) => {
  return isDark ? cardClasses.dark : cardClasses.light;
};

export const getTextClass = (isDark, level = 'primary') => {
  return isDark ? textClasses.dark[level] : textClasses.light[level];
};

export const getBgClass = (isDark, type = 'gradient') => {
  return isDark ? bgClasses.dark[type] : bgClasses.light[type];
};

export const getButtonClass = (isDark, isActive = false) => {
  if (isActive) return buttonClasses.active;
  return isDark ? buttonClasses.dark : buttonClasses.light;
};

export const getBorderClass = (isDark, type = 'primary') => {
  return isDark ? borderClasses.dark[type] : borderClasses.light[type];
};

// Theme Configuration Object
export const themeUtilities = {
  card: {
    container: (isDark) =>
      mergeClasses(
        getCardClass(isDark),
        'rounded-2xl p-8 transition-all duration-300'
      ),
    hover: hoverClasses.glow,
  },

  button: {
    primary: (isDark) =>
      mergeClasses(
        'px-4 py-2 rounded-lg font-medium transition-all duration-300',
        getButtonClass(isDark)
      ),
    secondary: (isDark) =>
      mergeClasses(
        'px-4 py-2 rounded-lg font-medium border transition-all duration-300',
        getBorderClass(isDark),
        getTextClass(isDark, 'secondary')
      ),
  },

  input: {
    base: (isDark) =>
      mergeClasses(
        'w-full px-4 py-3 rounded-lg outline-none transition-all',
        isDark
          ? 'bg-slate-900/40 border border-blue-500/30 text-gray-100'
          : 'bg-white/60 border border-blue-200 text-slate-900'
      ),
    focus: (isDark) =>
      mergeClasses(
        isDark ? 'focus:border-blue-500/50' : 'focus:border-blue-400',
        'focus:shadow-lg focus:shadow-blue-500/20'
      ),
  },

  badge: {
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
};

// Export all as default
export default {
  cardClasses,
  textClasses,
  bgClasses,
  borderClasses,
  hoverClasses,
  buttonClasses,
  iconClasses,
  gradientClasses,
  animationClasses,
  spacingClasses,
  roundedClasses,
  mergeClasses,
  getCardClass,
  getTextClass,
  getBgClass,
  getButtonClass,
  getBorderClass,
  themeUtilities,
};
