import toast from "react-hot-toast"
import Toast from "../other/Toast"
import { useRef } from "react";
import { Drawer } from "vaul";
import useSetting from "../../store/settings";

function HistoryCard({ title }: { title: string }) {
    return (
        <div className=" p-2 rounded-md bg-secondary-background  flex gap-[5px] items-center ">
            {/* <div className="w-[32px] h-[32px] rounded-full bg-black"></div> */}
            <p className="text-textcolor">{title}</p>
            <button className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="#FF0000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
            </button>
        </div>
    )
}

interface chat {
    id: string,
    actor: string,
    body: string
}
interface responsechat{
    id: string,
    actor: string,
    stream: ReadableStreamDefaultReader<Uint8Array>,
}


async function generateChat(url: string, model: string, prompt: string, signal: AbortSignal): Promise<ReadableStreamDefaultReader<Uint8Array> | undefined> {
    try {
        const response = await fetch(`${url}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: model, prompt: prompt,stream:true }),
            signal: signal
        })
        if (response.status == 200 && response.body) {
            const reader = response.body.getReader();
            return reader
        }
        toast.custom(<Toast body="Something went wronge" />,{id:"toast"})
        return undefined
    } catch(err){
        toast.custom(<Toast body="Server Unreachable" />,{id:"toast"})
        return undefined
    }


}


interface chatInputProps {
    setChats: React.Dispatch<React.SetStateAction<chat[]>>,
    setCurrentResponse: React.Dispatch<React.SetStateAction<responsechat | null>>,
    generating:boolean,
    setGenerating:React.Dispatch<React.SetStateAction<boolean>>,
    controller: React.MutableRefObject<AbortController>
}


function ChatInput({controller,generating,setGenerating, setChats, setCurrentResponse }: chatInputProps) {
    
    const baseUrl = useSetting(state => state.baseUrl)
    const currentModel = useSetting(state => state.currentModel)

    const handleSend = async () => {
        inputRef.current?.focus()
        if (inputRef.current && inputRef.current.value) {
            const body: string = inputRef.current.value
            setChats(p => ([...p, { id: `${Math.floor(Date.now() / 1000)}`, actor: "You", body: body }]))
            inputRef.current.value = ""
            setGenerating(true)
            if (currentModel) {
                const reader = await generateChat(baseUrl, currentModel, body, controller.current.signal)
                if (reader) {
                    const id = `${Math.floor(Date.now() / 1000)}`
                    setCurrentResponse({ id: id, actor:currentModel.split(":")[0] , stream: reader })
                }
            }
        }
    }

    const handleStop = () => {
        controller.current.abort()
        controller.current = new AbortController()
        setGenerating(false)
        return
    }

    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    return (
        <div className="mb-[10px] mx-2  flex items-center gap-[1px] pl-1 pr-2 py-1 bg-secondary-background shadow-sm rounded-md ">
            <Drawer.Root>
                <Drawer.Trigger className="flex items-center justify-center" asChild>
                    <button className="flex items-center justify-center w-[25px] h-[25px]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-sidebar-right" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                            <path d="M15 4l0 16" />
                        </svg></button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-secondary-background" />
                    <Drawer.Content className="bg-background  fixed bottom-0 left-0 right-0  rounded-t-[10px]">
                        <div className=" flex flex-col gap-[10px]   items-center p-4 rounded-t-[10px]">
                            <div className="min-w-[80px] min-h-[5px] rounded-l-md rounded-r-md bg-accent "></div>
                            <div className="mt-[20px] mb-[20px] font-extrabold text-2xl text-textcolor">
                                <h2>Chat History</h2>
                            </div>
                            <div className="mb-[20px] w-full max-h-[500px] px-4   flex flex-col gap-[10px] overflow-y-auto ">
                                <HistoryCard title="network request" />
                                <HistoryCard title="history" />
                                <HistoryCard title="wrote an email" />
                            </div>
                            <button className="p-2 rounded-full bg-primary group ">
                                <svg xmlns="http://www.w3.org/2000/svg" className=" hover:stroke-white  icon icon-tabler icon-tabler-plus" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 5l0 14" />
                                    <path d="M5 12l14 0" />
                                </svg>
                            </button>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
            <textarea autoFocus={true} ref={inputRef} rows={1} className=" resize-none bg-transparent appearance-none focus:outline-none flex-grow text-textcolor   px-2 py-2 text-md" placeholder="Chat ....." ></textarea>
            {currentModel == null ? 
                <button className="w-[30px] h-[30px]  rounded-md bg-primary disabled:opacity-25 flex items-center justify-center" onClick={handleSend}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-up" width={18} height={18} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M18 11l-6 -6" />
                    <path d="M6 11l6 -6" />
                </svg>

            </button>
            :generating ?
                <button className="flex items-center justify-center w-[30px] h-[30px]  rounded-md   bg-red-600/40 " onClick={handleStop}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-filled" width={10} height={10} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" strokeWidth={0} fill="currentColor" />
                    </svg>

                </button>
                :
                <button className="w-[30px] h-[30px]  rounded-md bg-primary flex items-center justify-center" onClick={handleSend}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-up" width={18} height={18} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M18 11l-6 -6" />
                        <path d="M6 11l6 -6" />
                    </svg>

                </button>

            }
        </div>
    )
}

export default ChatInput