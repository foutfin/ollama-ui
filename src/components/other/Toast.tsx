function Toast({body}:{body:string}){
    return( <div className=" rounded-md p-2  bg-secondary text-[12px] font-bold ">
    <span>{body}</span>
</div>)
}

export default Toast