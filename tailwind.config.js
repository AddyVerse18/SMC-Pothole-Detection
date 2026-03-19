/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b9fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1e3a8a',
          800: '#172554',
          900: '#0F172A',
          950: '#080e1c',
        },
        status: {
          critical:         '#ef4444',
          criticalBg:       '#fef2f2',
          criticalBorder:   '#fecaca',
          pending:          '#f59e0b',
          pendingBg:        '#fffbeb',
          pendingBorder:    '#fde68a',
          resolved:         '#10b981',
          resolvedBg:       '#ecfdf5',
          resolvedBorder:   '#a7f3d0',
          assigned:         '#3b82f6',
          assignedBg:       '#eff6ff',
          assignedBorder:   '#bfdbfe',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.25s ease-out',
        'fade-in':  'fadeIn 0.3s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
        'count-up': 'countUp 0.6s ease-out',
        'sidebar-expand': 'sidebarExpand 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'kpi': '0 2px 8px rgba(15,23,42,0.08)',
      },
      borderRadius: {
        'xl2': '14px',
      },
    },
  },
  plugins: [],
}
