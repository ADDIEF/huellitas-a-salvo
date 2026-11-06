/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta "Huellitas a Salvo": pastel + naranja fuerte para CTA
        naranja: { DEFAULT: '#F97316', oscuro: '#EA580C', claro: '#FDBA74' },
        cafe: { DEFAULT: '#A47148', oscuro: '#6B4A32' },
        lila: { suave: '#EDE0F7', fuerte: '#D8B4E2' },
        rosita: { suave: '#FFE4EC', fuerte: '#FFD1DC' },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Quicksand', 'sans-serif'],
      },
      animation: {
        flotar: 'flotar 7s ease-in-out infinite',
      },
      keyframes: {
        flotar: {
          '0%, 100%': { transform: 'translateY(0) rotate(-8deg)' },
          '50%': { transform: 'translateY(-16px) rotate(8deg)' },
        },
      },
    },
  },
  plugins: [],
};
