namespace Misc {
    export function isDefined(x:any):boolean{
        return ( (x!=undefined) && (x!=null) && (x!="null") )
    }

    export function nbr(content:string){
        return content.
            replace(new RegExp(" ","g"),"&nbsp;").
            replace(new RegExp("\\-","g"),"&#8209;")
    }

    // from: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    export function formatDurationSeconds(sec_num:number){        
        sec_num=Math.round(sec_num)
        var hours:any   = Math.floor(sec_num / 3600);
        var minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds:any = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    export function formatDurationMilliSeconds(millisec_num:number){
        return formatDurationSeconds(millisec_num/1000)
    }

    export class Logitem{
        content:string
        isinfo:boolean=false
        isok:boolean=false
        iserror:boolean=false        
        constructor(content:string){
            this.content=content
        }        
        info():Logitem{
            this.isinfo=true
            return this
        }
        ok():Logitem{
            this.isok=true
            return this
        }
        error():Logitem{
            this.iserror=true
            return this
        }
    }
    export class Logger{
        MAX_ITEMS=50
        items:Logitem[]=[]
        log(li:Logitem){
            this.items.push(li)
            if(this.items.length>this.MAX_ITEMS){
                this.items=this.items.slice(1)
            }
        }
        reportText():string{
            return this.items.slice().reverse().map(x=>x.content).join("\n")
        }
        reportHtml():string{
            return this.items.slice().reverse().map(x=>{
                let content=x.content.replace(new RegExp("\\n","g"),"<br>")
                if(x.isinfo) content=`<font color="blue">${content}</font>`
                if(x.isok) content=`<font color="green">${content}</font>`
                if(x.iserror) content=`<font color="red">${content}</font>`
                return content
            }).join("<br>").replace(/ /g,"&nbsp;")
        }
    }
    export class Timer{
        caption:string
        log:(Logitem)=>void
        now:number
        constructor(_caption:string,_log:(Logitem)=>void){
            this.caption=_caption
            this.log=_log
            this.now=performance.now()
        }
        report(){
            let elapsed=performance.now()-this.now            
            this.log(new Logitem(this.caption+" took "+elapsed.toLocaleString()))
        }
    }

    export abstract class JsonSerializableState{        
        abstract fromJson(json:any)
        fromJsonText(jsontext:string){
            this.fromJson(JSON.parse(jsontext))
        }                
    }

    export function roughlyEqualStrings(a:string,b:string):boolean{
        return a.toLowerCase()==b.toLowerCase()
    }

    export function updateObjectWith(obj:any,update:any):any{
        for(let property in update){            
            if(obj[property]==undefined){
                obj[property]=update[property]
            }
        }
        return obj
    }

    export function limit(x:number,min:number,max:number):number{
        if(x<min) return min
        if(x>max) return max
        return x
    }

    export function scoreColor(score:number){
        if(score<-1000) return "#f00"
        if(score<-500) return "#a00"
        if(score<0) return "#700"
        if(score<500) return "#070"
        return("#0f0")
    }
}