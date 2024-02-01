/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    extend: {
      fontFamily :{
        "sans" :['Fira Sans','sans-serif']
      }
    },
  },
  plugins: [],
}

