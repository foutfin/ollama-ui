import { useState } from "react"
import useSetting from "../../store/settings"
import { listModels, checkBaseurl, replaceSlashAtEnd } from "../../utils/utils"
import toast from "react-hot-toast"
import Toast from "../other/Toast"

function Settings() {
    const [url, setUrl] = useState<string>("")
    const [select, setSelect] = useState<"on" | "off" | "fetch">("off")
    const baseUrl = useSetting(state => state.baseUrl)
    const setModels = useSetting(state => state.setModels)
    const changeBaseUrl = useSetting(state => state.changeBaseUrl)

    const handleChangeUrl = async (e: any) => {
        e.stopPropagation()
        setSelect("fetch")
        toast.custom(<Toast body="Checking Url" />,{id:"toast"})
        if (await checkBaseurl(replaceSlashAtEnd(url))) {
            changeBaseUrl(url)
            setSelect("on")
            toast.custom(<Toast body="Now fetching model list" />,{id:"toast"})
            const models = await listModels(url)
            if (models.length == 0) {
                toast.custom(<Toast body="No models" />,{id:"toast"})
                console.log("No models available")
                setModels(models)
                return
            }
            toast.custom(<Toast body="Models added" />,{id:"toast"})
            setModels(models)
            return
        }
        setSelect("on")
        toast.custom(<Toast body="Url not reachable" />,{id:"toast"})
        console.log("Unreachabel url check it again")
        changeBaseUrl(baseUrl)
    }


    return (
        <div className="  rounded-md relative group flex">

            <button onClick={() => (setSelect("on"))} className="active:rotate-[360deg] transition-transform ease-in-out duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                </svg>
            </button>

            {(select == "on" || select == "fetch") &&

                <div onClick={() => ((select != "fetch") && setSelect("off"))} className="  z-10 fixed inset-0 bg-secondary-background flex items-center justify-center">

                    <div className=" bg-background animate-popup-out flex flex-col gap-[10px]   items-center p-4 rounded-[10px]">
                        <h2 className="font-bold text-md ">Ollama Server Base Url</h2>
                        <input onClick={e => e.stopPropagation()} onChange={e => setUrl(e.target.value)} placeholder={baseUrl} className=" focus:outline-accent opacity-80  text-md p-2 w-full mt-[5px] bg-secondary-background shadow-sm rounded-md" id="baseurl" />
                        <button disabled={select == "fetch" || url.length == 0} onClick={(e) => handleChangeUrl(e)} className=" disabled:opacity-70 ease-in active:scale-90 transition-all  mt-[5px] px-4 py-1 bg-primary rounded-md ">
                            {select == "fetch" ?
                                <svg  xmlns="http://www.w3.org/2000/svg" className=" origin-center animate-spin icon icon-tabler icon-tabler-loader-2" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 3a9 9 0 1 0 9 9" />
                                </svg>
                                :
                                "Done"
                            }
                        </button>
                    </div>
                </div>

            }


        </div>
    )
}

export default Settings