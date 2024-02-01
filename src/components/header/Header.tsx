import ollama from "../../assets/ollama.png"
function Header(){
    return (
    <header className="p-2 flex items-center ">
        <div className="w-[32px]">
            <img className="w-100 h-100" src={ollama} alt="" />
        </div>
        <div className="ml-auto border-[1px] border-black rounded-md">
            <button className="px-1 py-1">change theme</button>
        </div>
    </header>)
}

export default Header