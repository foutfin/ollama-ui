import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import allyLight from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-light'
import { create } from 'zustand'

type variant = "dark" | "light"

interface theme {
    name: string,
    variant: variant,
    codeStyle: { [key: string]: React.CSSProperties },
    lightClassname: string,
    darkClassname: string
}

interface themeStore {
    currentTheme: theme
    changeTheme: (name: string, variant: variant, lightClassname: string, darkClassname: string) => void
    toggleVariant: () => void
    chnageVariant: (variant: string) => void
}

const applyTheme = (addClassName: string, removeClassName: string) => {
    document.body.classList.remove(removeClassName)
    document.body.classList.add(addClassName)
}

const useTheme = create<themeStore>()(set => ({
    currentTheme: {
        name: "default",
        variant: "light",
        codeStyle: allyLight,
        lightClassname: "theme-light",
        darkClassname: "theme-dark"
    },
    changeTheme: (name: string, variant: variant, lightClassname: string, darkClassname: string) => {
        if (variant == "light") {
            set({ currentTheme: { name: name, variant: variant, codeStyle: allyLight, lightClassname: lightClassname, darkClassname: darkClassname } })
            return
        }
        set({ currentTheme: { name: name, variant: variant, codeStyle: allyDark, lightClassname: lightClassname, darkClassname: darkClassname } })
    },
    toggleVariant: () => {
        set(state => {
            if (state.currentTheme.variant == "light") {
                applyTheme(state.currentTheme.darkClassname, state.currentTheme.lightClassname)
                return { currentTheme: { ...state.currentTheme, variant: "dark", codeStyle: allyDark } }
            }
            applyTheme(state.currentTheme.lightClassname, state.currentTheme.darkClassname)
            return { currentTheme: { ...state.currentTheme, variant: "light", codeStyle: allyLight } }
        })
    },
    chnageVariant: (variant: string) => {
        if (variant == "dark") {
            set(state => {
                applyTheme(state.currentTheme.darkClassname, state.currentTheme.lightClassname)
                return { currentTheme: { ...state.currentTheme, variant: "dark", codeStyle: allyDark } }
            })
            return 
        }
        set(state => {
            applyTheme(state.currentTheme.lightClassname, state.currentTheme.darkClassname)
            return { currentTheme: { ...state.currentTheme, variant: "light", codeStyle: allyLight } }
        })
    }
}))

export default useTheme


