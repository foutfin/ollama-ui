import { useEffect } from "react";
import useTheme from "../../store/theme"

function getPreferredColorScheme( ):string {
    if (window.matchMedia) {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        return 'dark';
      } else {
        return 'light';
      }
    }
    return 'light';
}

function updateTheme(variant:string,changeVariant:(variant:string)=>void){
        if(variant == "dark"){
            changeVariant("dark")
        }else{
            changeVariant("light")
        }
}


function ToggleVariant() {
    const currentTheme =  useTheme(state => state.currentTheme)
    const toogleVariant =  useTheme(state => state.toggleVariant)
    const changeVariant = useTheme(state => state.chnageVariant)

    useEffect(()=>{
        const variant = getPreferredColorScheme()
        updateTheme(variant,changeVariant)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
           if(event.matches ){
            updateTheme("dark",changeVariant)
            return
           }
            console.log("changed ",event )
            // const variant = getPreferredColorScheme(event)
            updateTheme("light",changeVariant)
        })
    },[])

    // console.log(currentTheme)
    let themeIcon 
    switch(currentTheme.variant){
        case "dark" :
            themeIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sun" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
          </svg>)
        break

        default :
        themeIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-moon" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg>)
    break
    }
   
    return <button onClick={toogleVariant}>
        {themeIcon}
    </button>
}

export default ToggleVariant