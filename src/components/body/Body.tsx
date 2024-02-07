import { useRef, useState } from "react"
import Chat from "./Chat"
import ChatInput from "./ChatInput"
import { Toaster } from "react-hot-toast"

interface chat {
    id:string,
    actor: string,
    body: string
}

interface responsechat {
    id:string,
    actor: string,
    stream: ReadableStreamDefaultReader<Uint8Array>
}

function Body(){
    const [chats, setChats] = useState<Array<chat>>([])
    const [currentResponse , setCurrentResponse] = useState<responsechat | null>(null)
    const [generating, setGenerating] = useState<boolean>(false)
    const scrollview = useRef<HTMLDivElement | null>(null)
    const scroller = useRef<HTMLDivElement | null>(null)
    const controller = useRef<AbortController>(new AbortController())

    return (
    <section className="relative bg-background shadow-md mt-[5px] flex-grow flex flex-col ">
        <Chat controller={controller} setCurrentResponse={setCurrentResponse} setChats={setChats} setGenerating={setGenerating} scroller={scroller} scrollview={scrollview} currentResponse={currentResponse} chats={chats}/>
        <ChatInput controller={controller} generating={generating} setGenerating={setGenerating}   setCurrentResponse={setCurrentResponse} setChats={setChats} />
        <Toaster
            position="top-center"
            containerStyle={{
                position:"absolute",
                top:"10px",
                padding:"0px"
            }}
            toastOptions={{
                style:{
                    padding:"0px",
                    margin:"0px" 
                }
            }}
        />
    </section>
    )
}

export default Body