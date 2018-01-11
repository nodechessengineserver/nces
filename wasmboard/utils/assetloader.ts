interface Loadable{
    load()
    ready():boolean
}

class TextAsset implements Loadable {
    url:string
    text:string
    isready:boolean=false
    constructor(_url:string){
        this.url=_url
    }
    load(){
        fetch(this.url).then(
            response => response.arrayBuffer()
        ).then(
            bytes => this.onload(bytes)
        )
    }
    onload(bytes:ArrayBuffer){
        let view=new Uint8Array(bytes)
        this.text=TextEncodingUtils.decode(view)
        this.isready=true
    }    
    ready():boolean{
        return this.isready
    }
    asJson(){
        return JSON.parse(this.text)
    }
}

class AjaxAsset implements Loadable {
    url:string="/ajax"    
    isready:boolean=false
    reqjson:any
    resjson:any
    constructor(_reqjson:any){
        this.reqjson=_reqjson
    }
    load(){
        let body=JSON.stringify(this.reqjson) 
        let headers = new Headers()
        headers.append("Content-Type", "application/json");       
        fetch(this.url,{
            method: 'post',
            headers: headers,
            body: body
        }).then(
            response=>response.json()
        ).then(
            data=>this.onload(data)
        )
    }
    onload(data:any){        
        this.resjson=data
        this.isready=true
    }    
    ready():boolean{
        return this.isready
    }    
}

class AssetLoader{
    WAIT:number=250
    RETRIES:number=40
    items:Loadable[]=[]
    callback:any
    errorcallback:any=function(){
        //console.log("loading assets failed");
    }
    add(l:Loadable):AssetLoader{
        this.items.push(l)
        return this
    }
    setcallback(_callback:any):AssetLoader{
        this.callback=_callback
        return this
    }
    seterrorcallback(_errorcallback:any):AssetLoader{        
        this.errorcallback=_errorcallback
        return this
    }
    retries:number
    load(){
        this.items.map(item=>item.load())
        //console.log("loading assets...")
        this.retries=0
        setTimeout(this.loadwait.bind(this),this.WAIT)
    }
    loadwait(){                        
        for(let i in this.items){
            if(!this.items[i].ready()){
                this.retries++
                if(this.retries<=this.RETRIES){
                    //console.log("waiting for assets to load... try "+this.retries)
                    setTimeout(this.loadwait.bind(this),this.WAIT)
                    return
                } else {                    
                    this.errorcallback()            
                    return
                }                
            }
        }
        //console.log("assets loaded ok")
        if(this.callback!=undefined) this.callback()
    }

}

class AjaxRequest{
    ajaxasset:AjaxAsset
    constructor(json:any){
        this.ajaxasset=new AjaxAsset(json)
        new AssetLoader().
            add(this.ajaxasset).        
            load()    
    }                      
}