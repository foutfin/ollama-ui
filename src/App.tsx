import Header from "./components/header/Header"
import Body from "./components/body/Body"
import { useEffect, useState } from "react"
import { listModels, checkBaseurl } from "./utils/utils"
import useSetting from "./store/settings"
import useTheme from "./store/theme"
import ollamadark from "./assets/ollama-dark.png"
import ollamalight from "./assets/ollama.png"
import Settings from "./components/header/Settings"
import { Toaster } from "react-hot-toast"


type applicationState = "loading" | "error" | "success"

function App() {
  const curTheme = useTheme(state => state.currentTheme)
  const setModels = useSetting(state => state.setModels)
  const [appState, setAppState] = useState<applicationState>("loading")
  let displayJsx

  useEffect(() => {
    const a = async () => {
      const url = "http://localhost:11434"
      if (await checkBaseurl(url)) {
        const models = await listModels(url)
        setModels(models)
        setAppState("success")
        return
      }
      setAppState("error")
    }
    a()
  }, [])

  switch (appState) {
    case "error":
      displayJsx = <div className="flex-grow bg-background flex flex-col items-center justify-center">

        <div className=" -mt-[100px] flex  gap-[15px] flex-col items-center  ">
          <div className='w-[100px]'>
            {curTheme.variant == "dark" ?
              <img className='w-full' src={ollamadark} alt="" />
              :
              <img className='w-full' src={ollamalight} alt="" />
            }

          </div>
          <div className="flex flex-col gap-[5px] items-center text-textcolor">
            <span className="font-extrabold text-xl">No Local Server Found</span>
            <span className="text-md opacity-75 font-bold ">Try changing server</span>
          </div>
          <Settings setAppState={setAppState}/>
        </div>
      </div>
      break
    case "success":
      displayJsx = <>
        <Header />
        <Body />
      </>
      break
    default:
      displayJsx = <div className="flex-grow bg-background flex items-center justify-center">
      <div className=" -mt-[100px] flex  gap-[15px] flex-col items-center  ">
        <div className='w-[100px]'>
          {curTheme.variant == "dark" ?
            <img className='w-full' src={ollamadark} alt="" />
            :
            <img className='w-full' src={ollamalight} alt="" />
          }

        </div>
        <svg  xmlns="http://www.w3.org/2000/svg" className=" origin-center animate-spin icon icon-tabler icon-tabler-loader-2" width={30} height={30} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 3a9 9 0 1 0 9 9" />
          </svg>
      </div>
    </div>
  }

  return (
    <div className=" text-textcolor flex flex-col h-[100dvh] ">
      {displayJsx}
      { appState != "success" && <Toaster
            position="top-center"
            containerStyle={{
                padding:"0px"
            }}
            toastOptions={{
                style:{
                    padding:"0px",
                    margin:"0px" 
                }
            }}
        />}
    </div>
  )
}

export default App