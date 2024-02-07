import { useState } from "react"
import useSetting from "../../store/settings"
import { listModels } from "../../utils/utils"
import toast from "react-hot-toast"
import Toast from "../other/Toast"

function RefreshModelButton({ size }: { size: number }) {

    const baseUrl = useSetting(state => state.baseUrl)
    const setModels = useSetting(state => state.setModels)
    const [ disable , setDisable ] = useState<boolean>(false)

    const refetchModelList = async () => {
        setDisable(true)
        toast.custom(<Toast body="Refreshing model list" />,{id:"toast"})
        const models = await listModels(baseUrl)
        setModels(models)
        toast.custom(<Toast body="Model list refreshed" />,{id:"toast"})
        setDisable(false)
    }

    return (
        <button disabled={disable} className=" disabled:opacity-25 flex items-center justify-center" onClick={refetchModelList}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload" width={size} height={size} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                <path d="M20 4v5h-5" />
            </svg>
        </button>
    )
}


function ModelSelect() {
    const currentModel = useSetting(state => state.currentModel)
    const models = useSetting(state => state.models)

    const setModel = useSetting(state => state.setModel)
    const changeModel = (model: string) => {
        setModel(model)
        setSelect(false)
    }
    const [select, setSelect] = useState<boolean>(false)
    return (
        <div className="  rounded-md relative group flex">
            {currentModel == null ?
                <div className="px-2 py-1 flex gap-[5px] items-center text-sm font-extrabold opacity-80">
                    <span>No models</span>
                    <RefreshModelButton size={16} />
                </div>
                :
                <>

                    {select ?
                        <button onClick={() => setSelect(true)} className="bg-secondary px-2 py-1 rounded-md text-sm font-extrabold opacity-80 flex items-center gap-[3px]">
                            <span>{currentModel}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </button>
                        :
                        <button onClick={() => setSelect(true)} className=" px-2 py-1  text-sm font-extrabold opacity-60 flex items-center gap-[3px]">
                            <span>{currentModel}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6 9l6 6l6 -6" />
                            </svg>
                        </button>

                    }

                    {select &&

                        <div onClick={() => setSelect(false)} className="  z-10 fixed inset-0 bg-secondary-background flex items-center justify-center">
                            <div className="bg-background animate-popup-out shadow-lg flex flex-col items-center gap-[20px] p-7 rounded-md text-md  font-medium  ">
                                <span className="  font-bold text-lg">Select a model</span>
                                <div className="flex flex-col gap-[5px]">
                                    {models.map(model => {
                                        return model == currentModel ? <button onClick={() => changeModel(model)} key={model} className="px-3 py-2 rounded-md bg-primary ">{model}</button>
                                            :
                                            <button key={model} onClick={() => changeModel(model)} className="px-3 py-2 ">{model}</button>

                                    })}
                                    <RefreshModelButton size={24} />
                                </div>

                            </div>
                        </div>

                    }
                </>
            }

        </div>
    )
}

export default ModelSelect