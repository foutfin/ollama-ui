async function listModels(url: string): Promise<Array<string>> {
    try {
      const res = await fetch(`${url}/api/tags`)
      const data  = await res.json()
  
      return data.models.map((e: any) => e.name)
    } catch {
      return []
    }
}


async function checkBaseurl(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: "HEAD" })
        return res.status == 200
    } catch {
        return false
    }
}

function replaceSlashAtEnd(url:string):string{
  let l = url.length -1
  while(url[l] == "/"){
    l -= 1
  }
  return url.slice(0,l+1)
}

export {listModels,checkBaseurl,replaceSlashAtEnd}