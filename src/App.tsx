import Header from "./components/header/Header"
import Body from "./components/body/Body"
import { useEffect, useState } from "react"
import { listModels, checkBaseurl } from "./utils/utils"
import useSetting from "./store/settings"



type applicationState = "loading" | "error" | "success"

function App() {
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
      displayJsx = <div>Error cannot connect to server ...</div>
      break
    case "success":
      displayJsx = <>
        <Header />
        {/* <Header baseUrl={baseUrl} setBaseUrl={setBaseUrl} models={models} setModels={setModels} /> */}
        <Body />
      </>
      break
    default:
      displayJsx = <div>Loading ...</div>
  }

  return (
    <div className=" text-textcolor flex flex-col h-[100dvh] ">
      {displayJsx}
    </div>
  )
}

export default App