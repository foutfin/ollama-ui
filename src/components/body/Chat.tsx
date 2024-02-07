import { useEffect, useRef, useState } from 'react'
import Markdown from 'marked-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import useTheme from "../../store/theme"
import toast from 'react-hot-toast'
import 'react-lowlight/common'
import Toast from '../other/Toast';
import ollamadark from "../../assets/ollama-dark.png"
import ollamalight from "../../assets/ollama.png"

interface chat {
    id: string,
    actor: string,
    body: string
}
interface responsechat {
    id: string,
    actor: string,
    stream: ReadableStreamDefaultReader<Uint8Array>
}


interface ChatProps {
    actor: string,
    body: string,
    scroller: React.MutableRefObject<HTMLDivElement | null>,
    scrollview: React.MutableRefObject<HTMLDivElement | null>
}

interface ResponseChatProps {
    id: string,
    actor: string,
    body: ReadableStreamDefaultReader<Uint8Array>,
    scroller: React.MutableRefObject<HTMLDivElement | null>,
    scrollview: React.MutableRefObject<HTMLDivElement | null>,
    setGenerating: React.Dispatch<React.SetStateAction<boolean>>,
    setChats: React.Dispatch<React.SetStateAction<chat[]>>,
    setCurrentResponse: React.Dispatch<React.SetStateAction<responsechat | null>>,
    controller: React.MutableRefObject<AbortController>

}


function Highlight({ snippet, language }: { snippet: string, language: string }) {
    const currentTheme = useTheme(state => state.currentTheme)
    return <SyntaxHighlighter id="codescroller" className='pb-3 overflow-x-auto !bg-background' language={language} style={currentTheme.codeStyle}  >
        {snippet}
    </SyntaxHighlighter>
}

function copyToClipboard(data: string) {
    toast.custom(<Toast body="Copied to clipboard" />, { id: "toast" })
    navigator.clipboard.writeText(data)
    
}


const renderer = {
    code(snippet: any, lang: any) {
        return <div className='my-[10px] rounded-md border-2 border-secondary-background bg-background drop-shadow-large '>
            <div className='py-1 px-3 flex items-center justify-between bg-secondary-background'>
                <span className=' text-primary font-sm font-extrabold'>{lang}</span>
                <div>
                    <button onClick={() => copyToClipboard(snippet)} className=' active:scale-150 transition-all duration-300  flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-copy" width={15} height={15} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                            <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='p-2'>
                <Highlight snippet={snippet} language={lang} />
                {/* <pre className='pb-3 overflow-x-auto'><code>{snippet}</code></pre> */}
                {/* <Lowlight className="pb-3 overflow-x-auto" language={lang} value={snippet} /> */}

            </div>
        </div>


    },
};

function Chat({ actor, body, scroller, scrollview }: ChatProps) {
    let haveToScroll = false
    if (scroller.current && scroller.current.scrollTop) {
        const a = scroller.current?.scrollTop
        const b = (scroller.current?.scrollHeight) - (scroller.current?.clientHeight)
        const sp = ((a / b) * 100)
        if (sp > 99) {
            haveToScroll = true
        }
    }

    useEffect(() => {
        if (haveToScroll) {
            scrollview.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [])
    const chatActor =  ( actor.length > 0) ? actor[0] :"Y" 
    return (
        <div className="  flex  items-start">
            {actor == "You" ?
                <div className="shadow-sm flex-shrink-0 w-[30px] h-[30px] rounded-full bg-primary  font-bold flex items-center justify-center">{chatActor}</div>
                :
                <div className="shadow-sm flex-shrink-0 w-[30px] h-[30px] rounded-full bg-accent  font-bold flex items-center justify-center">{chatActor}</div>
            }
            <div className="  rounded-md  px-2 overflow-hidden flex flex-col gap-[5px]">
                <h3 className="font-extrabold text-sm">{actor}</h3>
                <div className='text-sm'>
                    <Markdown value={body} renderer={renderer} />
                </div>
            </div>
        </div>
    )
}



function ResponseChat({ controller, setCurrentResponse, id, setChats, setGenerating, actor, body, scroller, scrollview }: ResponseChatProps) {
    const [response, setResponse] = useState<string>("")
    const haveToScroll = useRef<boolean>(true)
    const r = useRef<string>("")

    useEffect(() => {
        controller.current.signal.addEventListener("abort", () => {
            setChats(p => [...p, { id: `${id}-new`, actor: actor, body: r.current }])
            setCurrentResponse(null)
        })
        async function readLoop() {
            const decoder = new TextDecoder()

            while (true) {
                const chunk = await body.read()
                if (chunk) {
                    if (chunk.done) {
                        setChats(p => [...p, { id: `${id}-new`, actor: actor, body: r.current }])
                        setGenerating(false)
                        setCurrentResponse(null)
                        break
                    }
                    const v = decoder.decode(chunk.value)
                    let chunkResponse: string = ""

                    const regex = /","done":false\}\n\{"model":"/g
                    let match
                    let s = 0
                    while ((match = regex.exec(v)) != null) {
                        const slice = v.slice(s, match.index + 16)
                        chunkResponse = JSON.parse(slice.trim()).response
                        s += slice.length
                    }
                    if (s != 0) {
                        const slice = v.slice(s).trim()
                        chunkResponse = JSON.parse(slice).response
                    }
                    if (s == 0) {
                        chunkResponse = JSON.parse(v).response
                    }
                    r.current += chunkResponse

                    if (scroller.current && scroller.current.scrollTop) {
                        const a = scroller.current?.scrollTop
                        const b = (scroller.current?.scrollHeight) - (scroller.current?.clientHeight)
                        const sp = ((a / b) * 100)
                        if (sp > 99) {
                            haveToScroll.current = true
                        } else {
                            haveToScroll.current = false
                        }
                    }
                    setResponse(p => {
                        return p + chunkResponse
                    })
                }
            }
        }
        readLoop()
    }, [])
    const chatActor =  ( actor.length > 0) ? actor[0] :"Y" 
    useEffect(() => {
        if (haveToScroll.current) {
            scrollview.current?.scrollIntoView({ block: "end" })
        }
    }, [response])

    return (
        <div className="  flex  items-start">
            {actor == "You" ?
                <div className="shadow-sm flex-shrink-0 w-[30px] h-[30px] rounded-full bg-primary  font-bold flex items-center justify-center">{chatActor}</div>
                :
                <div className="shadow-sm flex-shrink-0 w-[30px] h-[30px] rounded-full bg-accent  font-bold flex items-center justify-center">{chatActor}</div>
            }
            <div className="px-2 w-full rounded-md text-sm   overflow-hidden flex flex-col gap-[5px]">
                <h3 className="font-extrabold ">{actor}</h3>

                <div>
                    <Markdown value={response} renderer={renderer} />
                </div>

            </div>
        </div>
    )
}




interface ChatContainerProps {
    setGenerating: React.Dispatch<React.SetStateAction<boolean>>,
    chats: Array<chat>,
    currentResponse: responsechat | null,
    scroller: React.MutableRefObject<HTMLDivElement | null>,
    scrollview: React.MutableRefObject<HTMLDivElement | null>,
    setChats: React.Dispatch<React.SetStateAction<chat[]>>,
    setCurrentResponse: React.Dispatch<React.SetStateAction<responsechat | null>>,
    controller: React.MutableRefObject<AbortController>
}

function ChatContainer({ controller, setGenerating, setChats, chats, scroller, setCurrentResponse, currentResponse, scrollview }: ChatContainerProps) {
    const curTheme = useTheme(state => state.currentTheme)
    return (
        <section className="  relative mb-[30px]  flex-grow    ">
            {chats.length == 0 ?
                <div className='absolute inset-0    '>
                    <div className='flex flex-col items-center  gap-[30px] mt-[200px]'>
                        <div className='w-[100px]'>
                            {curTheme.variant == "dark" ?
                                <img className='w-full' src={ollamadark} alt="" />
                            :
                                <img className='w-full' src={ollamalight} alt="" />
                            }
                            
                        </div>
                        <h1 className=' text-textcolor font-extrabold  text-xl'>How can I help You ?</h1>
                    </div>
                </div>
                :
                <div id="scroller" ref={scroller} className="ml-2 my-2  absolute inset-0 flex flex-col  overflow-y-scroll">
                    <div className="flex-grow"></div>
                    <div className=" px-3   flex flex-col gap-[20px]   ">
                        {chats.map(c => <Chat key={`${c.id}`} scroller={scroller} scrollview={scrollview} actor={c.actor} body={c.body} />)}
                        {currentResponse && <ResponseChat controller={controller} setCurrentResponse={setCurrentResponse} key={`${currentResponse.id}-res`} id={currentResponse.id} setChats={setChats} setGenerating={setGenerating} scroller={scroller} scrollview={scrollview} actor={currentResponse.actor} body={currentResponse.stream} />}
                    </div>
                    <div ref={scrollview} ></div>

                </div>
            }

        </section>
    )
}

export default ChatContainer