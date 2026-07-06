/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#060A13',
          900: '#0B1120',
          800: '#101A2E',
          700: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Tajawal', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(52, 211, 153, 0.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(52, 211, 153, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(52, 211, 153, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 60px -12px rgba(99, 102, 241, 0.6)',
      },
    },
  },
  plugins: [],
}
