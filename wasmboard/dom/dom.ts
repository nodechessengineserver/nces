// custom wrapper for the DOM

abstract class DomConfigElement {

}

class SizePx extends DomConfigElement {
    px:number
    constructor(_px:number){
        super()
        this.px=_px
    }
}

class DomConfig {
    elements:{[id:string]:DomConfigElement}={}
    add(id:string,e:DomConfigElement):DomConfig{
        this.elements[id]=e
        return this
    }
    getPx(id:string):number{
        return (<SizePx>this.elements[id]).px
    }
}

abstract class HTMLElement_{
    e:HTMLElement
    kind:string
    constructor(_kind:string){
        this.kind=_kind
        this.e=document.createElement(_kind)
    }
    setAttribute(name:string,value:string):HTMLElement_{
        this.e.setAttribute(name,value)
        return this
    }
    removeAttribute(name:string):HTMLElement_{
        this.e.removeAttribute(name)
        return this
    }
    appendChild(child:HTMLElement_):HTMLElement_{
        this.e.appendChild(child.e)
        return this
    }
    appendChilds(childs:HTMLElement_[]):HTMLElement_{
        childs.map(child=>this.appendChild(child))
        return this
    }
    addEventListener(type:string,listener:EventListenerOrEventListenerObject):HTMLElement_{
        this.e.addEventListener(type,listener)
        return this
    }
    get innerHTML():string{
        return this.e.innerHTML
    }
    set innerHTML(content:string){
        this.e.innerHTML=content
    }
    html(content:string):HTMLElement_{
        this.innerHTML=content
        return this
    }  
    getComputedStyle(){
        return getComputedStyle(this.e)
    }
    getComputedHeightPx():number{
        return this.getPx(this.getComputedStyle().height)
    }
    getComputedWidthPx():number{
        return this.getPx(this.getComputedStyle().width)
    }
    getComputedTopPx():number{
        return this.getPx(this.getComputedStyle().top)
    }
    getComputedLeftPx():number{
        return this.getPx(this.getComputedStyle().left)
    }
    getComputedBottomPx():number{
        return this.getComputedTopPx()+this.getComputedHeightPx()
    }
    getComputedRightPx():number{
        return this.getComputedLeftPx()+this.getComputedWidthPx()
    }
    scrollTop(scrolltop:number):HTMLElement_{
        this.e.scrollTop=scrolltop
        return this
    }    
    getScrollTop():number{
        return this.e.scrollTop
    }    
    scrollLeft(scrollleft:number):HTMLElement_{
        this.e.scrollLeft=scrollleft
        return this
    }    
    getScrollLeft():number{
        return this.e.scrollLeft
    }    
    focus(){
        this.e.focus()
    }
    blur(){
        this.e.blur()
    }
    fontSize(fontsize:string):HTMLElement_{
        this.e.style.fontSize=fontsize
        return this
    }
    fontSizePx(fontsizepx):HTMLElement_{
        return this.fontSize(fontsizepx+"px")
    }
    fontFamily(fontfamily:string):HTMLElement_{
        this.e.style.fontFamily=fontfamily
        return this
    }
    fontWeight(fontweight:string):HTMLElement_{
        this.e.style.fontWeight=fontweight
        return this
    }
    borderCollapse(bordercollapse:string){
        this.e.style.borderCollapse=bordercollapse
        return this
    }
    border(border:string){
        this.e.style.border=border
        return this
    }
    borderPx(borderpx:number){
        return this.border(borderpx+"px")
    }
    borderTopStyle(bordertopstyle:string){
        this.e.style.borderTopStyle=bordertopstyle
        return this
    }
    borderLeftStyle(borderleftstyle:string){
        this.e.style.borderLeftStyle=borderleftstyle
        return this
    }
    borderBottomStyle(borderbottomstyle:string){
        this.e.style.borderBottomStyle=borderbottomstyle
        return this
    }
    borderRightStyle(borderrightstyle:string){
        this.e.style.borderBottomStyle=borderrightstyle
        return this
    }
    borderStyle(borderstyle:string){
        this.e.style.borderTopStyle=borderstyle
        this.e.style.borderLeftStyle=borderstyle
        this.e.style.borderBottomStyle=borderstyle
        this.e.style.borderRightStyle=borderstyle
        return this
    }
    borderTopColor(bordertopcolor:string){
        this.e.style.borderTopColor=bordertopcolor
        return this
    }
    borderLeftColor(borderleftcolor:string){
        this.e.style.borderLeftColor=borderleftcolor
        return this
    }
    borderBottomColor(borderbottomcolor:string){
        this.e.style.borderBottomColor=borderbottomcolor
        return this
    }
    borderRightColor(borderrightcolor:string){
        this.e.style.borderBottomColor=borderrightcolor
        return this
    }
    borderColor(bordercolor:string){
        this.e.style.borderTopColor=bordercolor
        this.e.style.borderLeftColor=bordercolor
        this.e.style.borderBottomColor=bordercolor
        this.e.style.borderRightColor=bordercolor
        return this
    }
    borderSpacing(borderspacing:string){
        this.e.style.borderSpacing=borderspacing
        return this
    }
    borderSpacingPx(borderspacingpx:number){
        return this.borderSpacing(borderspacingpx+"px")
    }
    verticalAlign(verticalalign:string){
        this.e.style.verticalAlign=verticalalign
        return this
    }
    padding(padding:string){
        this.e.style.padding=padding                
        return this
    }
    paddingPx(paddingpx:number){
        return this.padding(paddingpx+"px")
    }
    paddingBottom(paddingbottom:string){
        this.e.style.paddingBottom=paddingbottom
        return this
    }   
    paddingBottomPx(paddingbottompx:number){
        return this.paddingBottom(paddingbottompx+"px")
    }
    paddingLeft(paddingleft:string){
        this.e.style.paddingLeft=paddingleft
        return this
    }   
    paddingLeftPx(paddingleftpx:number){
        return this.paddingLeft(paddingleftpx+"px")
    }
    paddingRight(paddingright:string){
        this.e.style.paddingRight=paddingright
        return this
    }   
    paddingRightPx(paddingrightpx:number){
        return this.paddingRight(paddingrightpx+"px")
    }
    paddingTop(paddingtop:string){
        this.e.style.paddingTop=paddingtop
        return this
    }   
    paddingTopPx(paddingtoppx:number){
        return this.paddingTop(paddingtoppx+"px")
    }    
    margin(margin:string):HTMLElement_{
        this.e.style.margin=margin
        return this
    }
    marginPx(marginpx:number){
        return this.margin(marginpx+"px")
    }
    marginTop(margintop:string):HTMLElement_{
        this.e.style.marginTop=margintop
        return this
    }
    marginTopPx(margintoppx:number){
        return this.marginTop(margintoppx+"px")
    }
    marginBottom(marginbottom:string):HTMLElement_{
        this.e.style.marginBottom=marginbottom
        return this
    }
    marginBottomPx(marginbottompx:number){
        return this.marginTop(marginbottompx+"px")
    }
    marginLeft(marginleft:string):HTMLElement_{
        this.e.style.marginLeft=marginleft
        return this
    }
    marginLeftPx(marginleftpx:number){
        return this.marginLeft(marginleftpx+"px")
    }
    marginRight(marginright:string):HTMLElement_{
        this.e.style.marginRight=marginright
        return this
    }
    marginRightPx(marginrightpx:number){
        return this.marginRight(marginrightpx+"px")
    }
    visibility(visibility:string){
        this.e.style.visibility=visibility
        return this
    }
    visibilityBoolean(visibilityboolean:boolean){
        return this.visibility(visibilityboolean?"visible":"hidden")
    }
    cursor(cursor:string):HTMLElement_{
        this.e.style.cursor=cursor
        return this
    }
    overflow(overflow:string):HTMLElement_{
        this.e.style.overflow=overflow
        return this
    }
    draggable(draggable:string){
        this.setAttribute("draggable",draggable)
        return this
    }
    draggableBoolean(draggableboolean:boolean){
        this.setAttribute("draggable",""+draggableboolean)
        return this
    }
    color(color:string):HTMLElement_{
        this.e.style.color=color
        return this
    }
    backgroundColor(color:string):HTMLElement_{
        this.e.style.backgroundColor=color
        return this
    }    
    position(position:string):HTMLElement_{
        this.e.style.position=position
        return this
    }
    width(width:string):HTMLElement_{
        this.e.style.width=width
        return this
    }
    widthPx(widthpx:number):HTMLElement_{
        return(this.width(widthpx+"px"))
    }
    height(height:string):HTMLElement_{
        this.e.style.height=height
        return this
    }
    heightPx(heightpx:number):HTMLElement_{
        return(this.height(heightpx+"px"))
    }
    top(top:string):HTMLElement_{
        this.e.style.top=top
        return this
    }
    topPx(toppx:number):HTMLElement_{
        return(this.top(toppx+"px"))
    }
    left(left:string):HTMLElement_{
        this.e.style.left=left
        return this
    }
    leftPx(leftpx:number):HTMLElement_{
        return(this.left(leftpx+"px"))
    }
    getPx(css:string):number{
        let cssnum=css.replace("px","")
        return parseFloat(css)
    }
    getTop():string{
        return this.e.style.top
    }
    getTopPx():number{
        return this.getPx(this.getTop())
    }
    getLeft():string{
        return this.e.style.left
    }
    getLeftPx():number{
        return this.getPx(this.getLeft())
    }
    getWidth():string{
        return this.e.style.width
    }
    getWidthPx():number{
        return this.getPx(this.getWidth())
    }
    getHeight():string{
        return this.e.style.height
    }
    getHeightPx():number{
        return this.getPx(this.getHeight())
    }
    getBottomPx():number{
        return this.getTopPx()+this.getHeightPx()
    }
    getRightPx():number{
        return this.getLeftPx()+this.getWidthPx()
    }
    zIndex(zindex:string):HTMLElement_{
        this.e.style.zIndex=zindex
        return this
    }
    zIndexNumber(zindexnumber:number):HTMLElement_{
        return(this.zIndex(""+zindexnumber))
    }
    background(background:string):HTMLElement_{
        this.e.style.background=background
        return this
    }
    opacity(opacity:string):HTMLElement_{
        this.e.style.opacity=opacity
        return this
    }
    opacityNumber(opacitynumber:number):HTMLElement_{
        return(this.opacity(""+opacitynumber))
    }
}

class HTMLDivElement_ extends HTMLElement_{
    constructor(){
        super("div")
    }
}

class HTMLButtonElement_ extends HTMLElement_{
    constructor(){
        super("input")        
        this.setAttribute("type","button")
    }
    value(value:string):HTMLButtonElement_{
        this.setAttribute("value",value)        
        return this
    }
    onmousedown(listener:EventListenerOrEventListenerObject):HTMLButtonElement_{
        this.addEventListener("mousedown",listener)
        return this
    }
}

class HTMLTableElement_ extends HTMLElement_{
    constructor(){
        super("table")        
    }
    borderAttribute(border:number):HTMLTableElement_{
        this.setAttribute("border",""+border)
        return this
    }
    cellpaddingAttribute(cellpadding:number):HTMLTableElement_{
        this.setAttribute("cellpadding",""+cellpadding)
        return this
    }
    cellspacingAttribute(cellspacing:number):HTMLTableElement_{
        this.setAttribute("cellspacing",""+cellspacing)
        return this
    }
}

class HTMLTableRowElement_ extends HTMLElement_{
    constructor(){
        super("tr")        
    }
}

class HTMLTableColElement_ extends HTMLElement_{
    constructor(){
        super("td")        
    }
}

class HTMLSelectElement_ extends HTMLElement_{
    constructor(){
        super("select")        
    }
}

class HTMLOptionElement_ extends HTMLElement_{
    constructor(){
        super("option")        
    }
}

class ComboBox_ extends HTMLSelectElement_{
    options:{[id:string]:HTMLOptionElement_}={}
    setOptions(options:{[id:string]:string}):ComboBox_{
        this.html("")
        for(let id in options){
            let o=new HTMLOptionElement_()            
            o.setAttribute("value",id)
            o.innerHTML=options[id]
            this.options[id]=o
            this.appendChild(o)
        }
        return this
    }
    setOptionsFromList(optionlist:string[]):ComboBox_{
        let options={}
        optionlist.map(o=>options[o]=o)
        return this.setOptions(options)
    }
    setSelected(id:string):ComboBox_{
        Object.keys(this.options).map(key=>{
            if(id==key) this.options[key].setAttribute("selected","true")
            else this.options[key].removeAttribute("selected")
        })        
        return this
    }
    onChange(handler:(Event)=>void):ComboBox_{
        this.addEventListener("change",handler)
        return this
    }
}

class HTMLInputElement_ extends HTMLElement_{
    constructor(){
        super("input")        
        this.setAttribute("type","text")
        this.addEventListener("keyup",this.keyup.bind(this))
    }
    getText():string{
        let v=(<HTMLInputElement>this.e).value
        return v
    }
    setText(value:string):HTMLInputElement_{
        (<HTMLInputElement>this.e).value=value
        return this
    }
    entercallback:any
    setEnterCallback(entercallback:any):HTMLInputElement_{
        this.entercallback=entercallback
        return this
    }
    editCur:number=0
    editlist:string[]=[]
    moveEditCur(dir:number){
        if(this.editlist.length<=0) return
        if(this.getText()==""){
            this.setText(this.editlist[this.editCur])
            return
        }
        this.editCur+=dir
        if(this.editCur>=this.editlist.length) this.editCur=0
        else if(this.editCur<0) this.editCur=this.editlist.length-1
        this.setText(this.editlist[this.editCur])
    }
    keyup(e:KeyboardEvent){        
        //console.log(e.code)
        if(e.code=="Enter"){        
            let text=this.getText()
            if((this.editlist.length<=0)||(this.editlist[this.editCur]!=text))
                this.editlist.splice(this.editCur,0,text)
            if(this.entercallback!=undefined){                
                this.entercallback()
                this.setText("")
            }
        }
        if(e.code=="ArrowUp"){
            this.moveEditCur(-1)
        }
        if(e.code=="ArrowDown"){
            this.moveEditCur(1)
        }
        if(e.code=="Escape"){
            this.setText("")
        }
    }
}

class HTMLTextAreaElement_ extends HTMLElement_{
    constructor(){
        super("textarea")
    }
    getText():string{
        let v=(<HTMLTextAreaElement>this.e).value
        return v
    }
    setText(value:string):HTMLTextAreaElement_{
        (<HTMLTextAreaElement>this.e).value=value
        return this
    }
}

class Tab{
    id:string
    caption:string
    constructor(_id:string,_caption:string){
        this.id=_id
        this.caption=_caption
    }
}

class TabPane_ extends HTMLElement_{
    H_MARGIN=4
    V_MARGIN=24
    PADDING=2
    UNSELECTED_TAB_BCOL="#dfdfdf"
    TABHTMLDivElement_BCOL="#afffff"
    SELECTED_TAB_BCOL=this.TABHTMLDivElement_BCOL

    id:string
    tabs:Tab[]
    tabtds:HTMLTableColElement_[]
    tabdivs:HTMLDivElement_[]
    table:HTMLTableElement_
    tr1:HTMLTableRowElement_
    tr2:HTMLTableRowElement_
    selid:string=null
    constructor(
        id:string,
        width:number,
        height:number,
        _tabs:Tab[],
        _selid:string=null
    ){        
        super("div")
        this.id=id
        this.selid=_selid
        this.tabs=_tabs
        this.tabtds=[]
        this.tabdivs=[]
        this.
            widthPx(width-2*this.PADDING).
            heightPx(height-2*this.PADDING).
            backgroundColor("#cfcfcf").
            overflow("hidden").
            paddingPx(this.PADDING)
        this.table=new HTMLTableElement_()
        this.tr1=new HTMLTableRowElement_()
        this.tr2=new HTMLTableRowElement_()
        let ctd=new HTMLTableColElement_()
        let ctddiv=new HTMLDivElement_().position("relative")
        for(let tabi in _tabs){
            let tab=_tabs[tabi]
            let ttd=new HTMLTableColElement_().                
                backgroundColor(this.UNSELECTED_TAB_BCOL).                
                cursor("pointer").
                paddingPx(this.PADDING).
                html(tab.caption)
            ttd.addEventListener("mousedown",this.tabhandler.bind(this,this.tabtdId(tab.id),tab.id))
            this.tabtds.push(ttd)
            this.tr1.appendChild(ttd)            
            let div=new HTMLDivElement_().
                widthPx(width-this.H_MARGIN).
                heightPx(height-this.V_MARGIN).
                position("absolute").
                topPx(0).
                leftPx(0).
                backgroundColor(this.TABHTMLDivElement_BCOL).
                overflow("scroll").
                visibilityBoolean(false)
            ctddiv.appendChild(div)
            this.tabdivs.push(div)            
        }        
        ctd.appendChild(ctddiv)
        this.tr2.appendChild(ctd)
        this.table.appendChild(this.tr1)
        this.table.appendChild(this.tr2)
        this.appendChild(this.table)
        this.setSelected(this.selid)
    }
    setSelected(tabid:string=null){
        let scrollorig:boolean=false
        if(tabid==null){
            let storedselid=localStorage.getItem(this.id)
            if(storedselid!=undefined) this.selid=storedselid
            else this.selid=this.tabs[0].id
        }
        else {
            if(this.selid==tabid) scrollorig=true
            this.selid=tabid
        }
        for(let tabdivi in this.tabdivs){
            let tabdiv=this.tabdivs[tabdivi]
            let tab=this.tabs[tabdivi]
            let tabtd=this.tabtds[tabdivi]
            let v=(tab.id==this.selid)
            tabdiv.visibilityBoolean(v)
            tabtd.backgroundColor(v?this.SELECTED_TAB_BCOL:this.UNSELECTED_TAB_BCOL)
            if(v&&scrollorig){
                tabdiv.scrollTop(0).scrollLeft(0)
            }
        }
        localStorage.setItem(this.id,this.selid)
    }
    tabhandler(tabtdid:string,tabid:string,e:Event){        
        this.setSelected(tabid)
    }
    tabtdId(tabid:string):string{return tabid+"_tabtd"}
    contentId(tabid:string):string{return tabid+"_content"}
    getTabIndexById(tabid:string):number{
        for(let ti in this.tabs){
            let tab=this.tabs[ti]
            if(tab.id==tabid) return parseInt(ti)
        }
        return 0
    }
    getTabDivById(tabid:string){
        return this.tabdivs[this.getTabIndexById(tabid)]
    }
    setContent(tabid:string,content:string){
        let ti=this.getTabIndexById(tabid)
        let tabdiv=this.tabdivs[ti]        
        tabdiv.html(content)
    }
    setElement_(tabid:string,element_:HTMLElement_){
        let ti=this.getTabIndexById(tabid)
        let tabdiv=this.tabdivs[ti]
        tabdiv.html("").appendChild(element_)
    }
}

class HTMLAnchorElement_ extends HTMLElement_{
    constructor(){
        super("a")
    }
    href(href:string):HTMLAnchorElement_{
        this.setAttribute("href",href)
        return this
    }
}

class HTMLBRElement_ extends HTMLElement_{
    constructor(){
        super("br")
    }
}

class HTMLLabelElement_ extends HTMLElement_{
    constructor(){
        super("label")
    }
    setText(value:string):HTMLLabelElement_{
        (<HTMLLabelElement>this.e).innerHTML=value
        return this
    }
}

class HTMLSpanElement_ extends HTMLElement_{
    constructor(){
        super("span")
    }
}

class PaddedTd extends HTMLTableColElement_ {
    constructor(paddingpx:number=3){
        super()
        this.paddingPx(paddingpx)
    }
}

class FileChooserState extends Misc.JsonSerializableState {
    dirpathl:string[]=["C:"]
    name:string="default"
    action:string=""

    dirpath():string{        
        return this.dirpathl.join("/")+"/"
    }

    fullpath():string{
        return this.dirpath()+this.name
    }

    pathInfo(MAX:number=50):string{        
        let path=this.dirpath()                
        if(path.length<MAX) return path
        return "..."+path.substr(path.length-MAX)
    }

    fromJson(json):FileChooserState{
        this.dirpathl=json.dirpathl
        this.name=json.name
        return this
    }
    clone():FileChooserState{
        let fc=new FileChooserState()
        fc.fromJsonText(JSON.stringify(this))
        return fc
    }
}

class FileChooser extends HTMLTableElement_ {
    static registry:{[id:string]:FileChooser}={}
    opendialog:FileDialogWindow=null

    dialogroot:HTMLElement_
    dirinput:HTMLLabelElement_
    nameinput:HTMLInputElement_

    state:FileChooserState=new FileChooserState()

    id:string

    hide(){
        if(this.opendialog!=null) this.opendialog.hide()
        this.opendialog=null
    }
    hideAll(){
        for(let id in FileChooser.registry){
            let fc=FileChooser.registry[id]
            fc.hide()
        }
    }

    dirSelected(fcstate:FileChooserState){
        this.hideAll()
        if((fcstate.action=="select")||(fcstate.action=="selectfile")) this.state.dirpathl=fcstate.dirpathl
        if(fcstate.action=="selectfile") this.state.name=fcstate.name
        this.save()
        this.build()
    }

    choosedrivebuttonpressed(e:Event){
        let drivename=prompt("Enter drive name !")
        if((drivename=="undefined")||(drivename==null)||(drivename=="")) {}                
        else{
            this.state.dirpathl=[drivename]
            this.save()
            this.build()
        }
    }

    choosedirbuttonpressed(e:Event){
        let shouldopen=this.opendialog==null
        this.hideAll()        
        if(shouldopen){
            this.opendialog=new FileDialogWindow(this.id+"_dirdialog").
                setTitle("File").
                setFileChooserState(this.state.clone()).
                setDirSelectedCallback(this.dirSelected.bind(this)).
                build()
            this.dialogroot.html("").appendChild(
                this.opendialog
            )
        }
    }       
    savecallback:(FileChooserState)=>void=null
    loadcallback:(FileChooserState)=>void=null
    deletecallback:(FileChooserState)=>void=null
    actualize(){
        this.state.name=this.nameinput.getText()
        this.save()
    }
    savebuttonpressed(e:Event){
        this.actualize()
        this.savecallback(this.state)
    }
    setSaveCallback(_savecallback:(FileChooserState)=>void):FileChooser{
        this.savecallback=_savecallback
        return this
    }
    loadbuttonpressed(e:Event){
        this.actualize()
        this.loadcallback(this.state)
    }
    setLoadCallback(_loadcallback:(FileChooserState)=>void):FileChooser{
        this.loadcallback=_loadcallback
        return this
    }
    deletebuttonpressed(e:Event){
        this.actualize()
        this.deletecallback(this.state)
    }
    setDeleteCallback(_deletecallback:(FileChooserState)=>void):FileChooser{
        this.deletecallback=_deletecallback
        return this
    }
    load(){
        let stored=localStorage.getItem(this.id)
        if(Misc.isDefined(stored)){
            this.state.fromJsonText(stored)
        }
    }
    save(){
        localStorage.setItem(this.id,JSON.stringify(this.state))
    }
    build():FileChooser{
        this.            
            borderCollapse("separate").
            borderSpacingPx(3).
            borderPx(1).
            borderStyle("solid").
            borderColor("#dfdfdf").            
            backgroundColor("#efefef").
            html("")
        this.dirinput=new HTMLLabelElement_()
        this.dirinput.
            fontFamily("monospace")
        this.nameinput=new HTMLInputElement_()
        let tr=new HTMLTableRowElement_()
        let choosedrivebutton=new HTMLButtonElement_().
            value(this.state.dirpathl[0]).
            onmousedown(this.choosedrivebuttonpressed.bind(this)).        
            widthPx(50)
        let choosedirbutton=new HTMLButtonElement_().
            value("...").
            onmousedown(this.choosedirbuttonpressed.bind(this))        
        let savebutton=new HTMLButtonElement_().
            value("Save").
            onmousedown(this.savebuttonpressed.bind(this))
        let loadbutton=new HTMLButtonElement_().
            value("Load").
            onmousedown(this.loadbuttonpressed.bind(this))
        let deletebutton=new HTMLButtonElement_().
            value("Delete").
            onmousedown(this.deletebuttonpressed.bind(this))
        tr.appendChilds([
            new PaddedTd().appendChild(choosedrivebutton),
            new PaddedTd().widthPx(400).appendChild(this.dirinput),
            new PaddedTd().appendChild(choosedirbutton),
            new PaddedTd().appendChild(this.nameinput)
        ])  
        if(this.savecallback!=null) tr.appendChild(new PaddedTd().appendChild(savebutton))      
        if(this.loadcallback!=null) tr.appendChild(new PaddedTd().appendChild(loadbutton))      
        if(this.deletecallback!=null) tr.appendChild(new PaddedTd().appendChild(deletebutton))      
        this.appendChild(tr)
        this.dirinput.setText(this.state.pathInfo())
        this.nameinput.setText(this.state.name)
        return this
    }
    constructor(_id:string,_dialogroot:HTMLElement_){
        super()
        this.id=_id
        FileChooser.registry[_id]=this
        this.dialogroot=_dialogroot        
        this.load()        
    }
}

class FileDialogWindowState {
    x:number=0
    y:number=0    
}

class FileDialogWindow extends HTMLDivElement_ {
    static BAR_WIDTH=36
    static BOTTOM_BAR_WIDTH=40
    static PADDING=3
    static OUTER_MARGIN=5
    id:string
    title:string=""
    state:FileDialogWindowState=new FileDialogWindowState()
    fcstate:FileChooserState=new FileChooserState()
    w:number=400
    h:number=400
    topbardiv:HTMLDivElement_
    contentdiv:HTMLDivElement_
    bottombardiv:HTMLDivElement_

    dragstart:Vectors.ScreenVector
    dragd:Vectors.ScreenVector
    dragunderway:boolean=false

    windowdragstart(e:Event){
        e.preventDefault()
        let me=<MouseEvent>e
        this.dragstart=new Vectors.ScreenVector(me.clientX,me.clientY)            
        this.dragunderway=true        
    }

    windowmouseout(e:Event){        
        this.windowmousemove(e)
        this.windowmouseup(null)
        this.dragunderway=false
    }

    static MAX_WINDOW_Y=300
    static MAX_WINDOW_X=1000

    windowmousemove(e:Event){  
        let me=<MouseEvent>e      
        if(this.dragunderway){
            this.dragd=new Vectors.ScreenVector(me.clientX,me.clientY).Minus(this.dragstart)                        
            this.
                topPx(Misc.limit(this.state.y+this.dragd.y,0,FileDialogWindow.MAX_WINDOW_Y)).
                leftPx(Misc.limit(this.state.x+this.dragd.x,0,FileDialogWindow.MAX_WINDOW_X))
        }
    }

    windowmouseup(e:Event){
        if(this.dragunderway){
            this.dragunderway=false            
            this.state.y=Misc.limit(this.state.y+this.dragd.y,0,FileDialogWindow.MAX_WINDOW_Y)
            this.state.x=Misc.limit(this.state.x+this.dragd.x,0,FileDialogWindow.MAX_WINDOW_X)
            this.save()
        }
    }

    load(){
        let stored=localStorage.getItem(this.id)
        if(Misc.isDefined(stored)) this.state=JSON.parse(stored)
    }

    save(){
        localStorage.setItem(this.id,JSON.stringify(this.state))
    }

    ajaxasset:AjaxAsset

    onDirectorySelected(){        
    }

    onDirectoryError(){
        
    }

    selectbuttonpressed(e:Event){
        this.fcstate.action="select"
        this.dirselectedcallback(this.fcstate)
    }

    cancelbuttonpressed(e:Event){
        this.fcstate.action="cancel"
        this.dirselectedcallback(this.fcstate)
    }

    createdirajaxasset:AjaxAsset
    onCreateDir(){
        let r=this.createdirajaxasset.resjson        
        this.contentdiv.
            html("").
            appendChild(this.createListContent(r.files))
    }
    onCreateDirError(){

    }
    createbuttonpressed(e:Event){
        let dirname=prompt("Enter directory name !")
        if((dirname=="undefined")||(dirname==null)||(dirname=="")) {}                
        else{
            this.createdirajaxasset=new AjaxAsset({
                action:"createdir",
                path:this.fcstate.dirpath(),
                name:dirname
            })
            new AssetLoader().
                add(this.createdirajaxasset).
                setcallback(this.onCreateDir.bind(this)).
                seterrorcallback(this.onCreateDirError.bind(this)).
                load()    
        }
    }

    totalHeight():number{
        return this.h+FileDialogWindow.BAR_WIDTH+FileDialogWindow.BOTTOM_BAR_WIDTH
    }

    build():FileDialogWindow{
        this.load()

        this.
            html("").            
            topPx(this.state.y).
            leftPx(this.state.x).
            widthPx(this.w+2*FileDialogWindow.OUTER_MARGIN).
            heightPx(this.totalHeight()+2*FileDialogWindow.OUTER_MARGIN).            
            background("url(assets/images/backgrounds/wood.jpg)").
            addEventListener("mousemove",this.windowmousemove.bind(this)).
            addEventListener("mouseup",this.windowmouseup.bind(this)).
            opacityNumber(0.9)
        let pathinfo=this.fcstate.pathInfo()        
        this.topbardiv.
            html(`<span style="opacity:0.6;">${this.title}</span> <span style="font-family:monospace;font-size:11px;color:#00f;">${pathinfo}</span>`).
            draggableBoolean(true).
            topPx(FileDialogWindow.OUTER_MARGIN).
            leftPx(FileDialogWindow.OUTER_MARGIN).
            paddingPx(FileDialogWindow.PADDING).
            fontSizePx(FileDialogWindow.BAR_WIDTH-3*FileDialogWindow.PADDING).
            widthPx(this.w-2*FileDialogWindow.PADDING).
            heightPx(FileDialogWindow.BAR_WIDTH-2*FileDialogWindow.PADDING).
            cursor("move").
            backgroundColor("#ccc").            
            addEventListener("dragstart",this.windowdragstart.bind(this)).
            addEventListener("mouseout",this.windowmouseout.bind(this)).
            opacityNumber(0.7)
        this.contentdiv.
            html("").
            topPx(FileDialogWindow.BAR_WIDTH+FileDialogWindow.OUTER_MARGIN).
            leftPx(FileDialogWindow.OUTER_MARGIN).
            widthPx(this.w).
            heightPx(this.h).
            overflow("scroll").
            backgroundColor("#ffffff")            
        this.bottombardiv.
            html(this.title).
            draggableBoolean(true).
            topPx(FileDialogWindow.BAR_WIDTH+this.h+FileDialogWindow.OUTER_MARGIN).
            leftPx(FileDialogWindow.OUTER_MARGIN).
            paddingPx(FileDialogWindow.PADDING).
            fontSizePx(FileDialogWindow.BAR_WIDTH-3*FileDialogWindow.PADDING).
            widthPx(this.w-2*FileDialogWindow.PADDING).
            heightPx(FileDialogWindow.BOTTOM_BAR_WIDTH-2*FileDialogWindow.PADDING).            
            backgroundColor("#afafaf").
            opacityNumber(0.7)
        let selectbutton=new HTMLButtonElement_().            
            value("Select Directory").            
            onmousedown(this.selectbuttonpressed.bind(this)).
            heightPx(FileDialogWindow.BOTTOM_BAR_WIDTH-2*FileDialogWindow.PADDING).
            marginRightPx(FileDialogWindow.PADDING)
        let cancelbutton=new HTMLButtonElement_().            
            value("Cancel").            
            onmousedown(this.cancelbuttonpressed.bind(this)).
            heightPx(FileDialogWindow.BOTTOM_BAR_WIDTH-2*FileDialogWindow.PADDING).
            marginRightPx(FileDialogWindow.PADDING)
        let createbutton=new HTMLButtonElement_().            
            value("Create").            
            onmousedown(this.createbuttonpressed.bind(this)).
            heightPx(FileDialogWindow.BOTTOM_BAR_WIDTH-2*FileDialogWindow.PADDING).
            marginRightPx(FileDialogWindow.PADDING)
        this.bottombardiv.html("").appendChilds([
            selectbutton,
            cancelbutton,
            createbutton
        ])     
        this.appendChilds([
            this.topbardiv,
            this.contentdiv,
            this.bottombardiv
        ])

        this.loadDir()

        return this
    }
    listdirajaxasset:AjaxAsset
    loadDir(){
        this.listdirajaxasset=new AjaxAsset({
            action:"listdir",
            path:this.fcstate.dirpath()
        })
        new AssetLoader().
            add(this.listdirajaxasset).
            setcallback(this.onListDir.bind(this)).
            seterrorcallback(this.onListDirError.bind(this)).
            load()    
    }
    createListContent(dirlist:any):HTMLElement_{
        let list=new HTMLDivElement_()
        let dirlistarray=<any[]>dirlist
        dirlistarray.sort((a,b)=>{
            if(a.isdir && !b.isdir) return -1
            if(!a.isdir && b.isdir) return 1
            return (<string>a.name).localeCompare(b.name)
        })
        let fstatsroot={
            ok:true,
            name:"..",
            isfile:false,
            isdir:true,
            stats:{}
        }
        dirlistarray.unshift(fstatsroot)
        let i=0;
        dirlistarray.map(fstats=>{            
            let stats=fstats.stats
            let bcol="#efefef"
            if(fstats.isdir) bcol=((i%2)==0)?"#ffffcf":"#ffffbf"
            if(fstats.isfile) bcol=((i%2)==0)?"#efefef":"#dfdfdf"
            if(!fstats.ok) bcol=((i%2)==0)?"#ffdfdf":"#ffcfcf"
            let itemdiv=new HTMLDivElement_().
                paddingPx(FileDialogWindow.PADDING).
                cursor("pointer").
                html(`<span style="color:${fstats.isdir?"#00f":"#000"};font-family:monospace;">${fstats.name}</span>`+
                (stats.mtime!=undefined?" "+`<font size="1">${stats.mtime}</font>`:"")).
                backgroundColor(bcol).
                addEventListener("mousedown",this.dirItemClicked.bind(this,fstats))
            list.appendChild(
                itemdiv
            )
            i++
        })
        return list
    }
    dirItemClicked(fstats:any,e:Event){
        if(fstats.ok && fstats.isdir){
            if(fstats.name==".."){
                if(this.fcstate.dirpathl.length>1){
                    this.fcstate.dirpathl.pop()
                }
            }else{
                this.fcstate.dirpathl.push(fstats.name)
            }
            this.build()
            return
        }

        if(fstats.ok && fstats.isfile){            
            this.fcstate.name=fstats.name         
            this.fcstate.action="selectfile"   
            this.dirselectedcallback(this.fcstate)
        }
    }
    onListDir(){
        let r=this.listdirajaxasset.resjson        
        this.contentdiv.
            html("").
            appendChild(this.createListContent(r.files))
    }
    onListDirError(){

    }
    hide():FileDialogWindow{
        this.html("").widthPx(0).heightPx(0)
        return this
    }
    constructor(_id:string){
        super()
        this.id=_id
        this.position("absolute").zIndexNumber(10000)
        this.topbardiv=new HTMLDivElement_().position("absolute")
        this.contentdiv=new HTMLDivElement_().position("absolute")
        this.bottombardiv=new HTMLDivElement_().position("absolute")
    }
    setTitle(_title:string):FileDialogWindow{
        this.title=_title
        return this
    }
    setFileChooserState(_fcstate:FileChooserState):FileDialogWindow{
        this.fcstate=_fcstate
        return this
    }
    dirselectedcallback:(FileChooserState)=>void
    setDirSelectedCallback(_dirselectedcallback:(FileChooserState)=>void):FileDialogWindow{
        this.dirselectedcallback=_dirselectedcallback
        return this
    }
}