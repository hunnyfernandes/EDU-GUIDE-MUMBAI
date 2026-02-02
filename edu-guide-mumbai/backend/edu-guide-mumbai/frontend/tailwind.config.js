/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EBF2FF',
          200: '#BBDFFF',
          300: '#8CC9FF',
          400: '#7A9EFF',
          500: '#3366FF',
          600: '#254EDB',
          700: '#1A3AAA',
          800: '#004C99',
          900: '#0D1F66',
        },
        secondary: {
          100: '#F3E8FF',
          200: '#D8B4FE',
          300: '#C084FC',
          400: '#A855F7',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#6C757D',
          500: '#495057',
          600: '#343A40',
          700: '#212529',
          800: '#1A1F26',
          900: '#0F1117',
        },
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'xxxl': '64px',
        'jumbo': '96px',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(51, 102, 255, 0.05)',
        'md': '0 4px 12px rgba(51, 102, 255, 0.1)',
        'lg': '0 8px 24px rgba(51, 102, 255, 0.15)',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
}
