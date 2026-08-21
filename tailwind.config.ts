import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        stage: {
          beginner: '#10b981',    // зеленый - начальная подготовка
          intermediate: '#f59e0b', // оранжевый - спортивная группа
          advanced: '#ef4444',     // красный - совершенствование
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
