/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    extend: {
      colors:{
        background:"var(--theme-background)",
        primary:"var(--theme-primary)",
        secondary:"var(--theme-secondary)",
        accent:"var(--theme-accent)",
        textcolor:"var(--theme-text)",
        "secondary-background":"var(--theme-secondary-background)"
      },
      dropShadow:{
        large:["0 4px 3px var(--theme-secondary-background)"]
      },
      fontFamily :{
        "sans" :['Fira Sans','sans-serif']
      },
      keyframes:{
        popup:{
          "from":{transform:"scale(0)"},
          
        }
      },
      animation:{
        'popup-out' : "popup 0.2s ease-in-out"
      }
    },
  },
  plugins: [
  ],
}

