/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'var(--white)',
      black: '#000',
      navy: {
        950: 'var(--navy-950)',
        900: 'var(--navy-900)',
        800: 'var(--navy-800)',
        700: 'var(--navy-700)',
        600: 'var(--navy-600)',
        500: 'var(--navy-500)',
        300: 'var(--navy-300)',
        100: 'var(--navy-100)',
        50:  'var(--navy-50)',
      },
      gray: {
        50:  'var(--gray-50)',
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        700: 'var(--gray-700)',
        900: 'var(--gray-900)',
      },
      accent: {
        700: 'var(--accent-700)',
        600: 'var(--accent-600)',
        500: 'var(--accent-500)',
        100: 'var(--accent-100)',
        50:  'var(--accent-50)',
      },
      success: {
        700: 'var(--success-700)',
        600: 'var(--success-600)',
        100: 'var(--success-100)',
        50:  'var(--success-50)',
      },
      warning: {
        700: 'var(--warning-700)',
        600: 'var(--warning-600)',
        100: 'var(--warning-100)',
        50:  'var(--warning-50)',
      },
      danger: {
        700: 'var(--danger-700)',
        600: 'var(--danger-600)',
        100: 'var(--danger-100)',
        50:  'var(--danger-50)',
      },
      info: {
        700: 'var(--info-700)',
        600: 'var(--info-600)',
        100: 'var(--info-100)',
        50:  'var(--info-50)',
      },
    },
    fontFamily: {
      sans: ['var(--font-jakarta)', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
    extend: {
      borderRadius: {
        'sm':   '4px',
        'md':   '6px',
        'lg':   '8px',
        'xl':   '12px',
        'pill': '999px',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
    },
  },
  plugins: [],
}
