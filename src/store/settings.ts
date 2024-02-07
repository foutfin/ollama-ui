import { create } from "zustand"

// interface Setting{

// }

interface SettingStore{
    baseUrl : string
    models :Array<string>
    currentModel : string | null
    changeBaseUrl : (url:string)=>void
    setModel : (model:string) => void
    setModels : (models:Array<string>) => void
}

const useSetting = create<SettingStore>()(set => ({
    baseUrl : "http://localhost:11434",
    models:[],
    currentModel: null,
    changeBaseUrl : (url:string)=> set(state =>({...state,baseUrl:url})),
    setModel : (model:string) => set(state =>({...state,currentModel:model})),
    setModels : (models:Array<string>) => set(state =>{
        if(models.length){
            return {...state,models:models,currentModel:models[0]}
        }
        return {...state,models:models,currentModel:null}
    })
})) 

export default useSetting