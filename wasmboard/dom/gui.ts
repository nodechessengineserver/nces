namespace Config {
    export let GuiConfig=new DomConfig().
        add("CONTROL_BUTTON_WIDTH",new SizePx(24)).
        add("PADDING",new SizePx(3)).
        add("CONTROL_BUTTON_PADDING_LEFT",new SizePx(3))
}

class GUIState{    
    _variant:string
    _pgn:string
    variantid():string{
        return "guistate_variant"
    }
    pgnid():string{
        return "guistate_"+this._variant+"_pgn"
    }
    set variant(variant:string){
        this._variant=variant
        localStorage.setItem(this.variantid(),variant)        
        this.pgn=localStorage.getItem(this.pgnid())
    }    
    set pgn(pgn:string){        
        this._pgn=pgn
        localStorage.setItem(this.pgnid(),pgn)                
    }

    hasVariant():boolean{                
        return ((this._variant!=undefined)&&(this._variant!=null)&&(this._variant!="null"))
    }
    hasPgn():boolean{
        return ((this._pgn!=undefined)&&(this._pgn!=null)&&(this._pgn!="null"))
    }

    constructor(){        
        this.variant=localStorage.getItem("guistate_variant")        
    }
}

class GUI{
    config=Config.GuiConfig

    LABEL_BCOL="#efefef"    

    book:Book=null
    bracket:Bracket=null
    players:LichessUsers=new LichessUsers()
    setup:Setup=new Setup()
    bookdiv:HTMLDivElement_
    bookcontentdiv:HTMLDivElement_
    controlpanel:HTMLDivElement_
    econtrolpanel:HTMLDivElement_
    ncontroldiv:HTMLDivElement_
    nissuetext:HTMLInputElement_
    neurallogdiv:HTMLDivElement_

    appconfig:any={}

    pastetext:HTMLInputElement_

    state:GUIState=new GUIState()
    root:HTMLDivElement_    
    dialogroot:HTMLDivElement_
    wboardroot:HTMLDivElement_
    saninputtext:HTMLInputElement_
    tabs:TabPane_
    logger:Misc.Logger
    nlogger:Misc.Logger
    fentext:HTMLInputElement_
    pgntext:HTMLTextAreaElement_
    configtext:HTMLTextAreaElement_
    pgnkeytext:HTMLInputElement_
    pgnvaluetext:HTMLInputElement_
    pgndiv:HTMLDivElement_
    configdiv:HTMLDivElement_
    srcdiv:HTMLDivElement_
    srctext:HTMLTextAreaElement_
    enginediv:HTMLDivElement_
    gamediv:HTMLDivElement_
    gameidtext:HTMLInputElement_
    bracketdiv:HTMLDivElement_
    variantcombo:ComboBox_

    analyzer:Analysis.Analyzer

    constructor(){
        this.root=new HTMLDivElement_().position("relative")        
        this.dialogroot=new HTMLDivElement_()
        document.body.appendChild(this.root.e)
    }

    log(li:Misc.Logitem){
        this.logger.log(li)
        //let text="<pre>"+this.logger.reportText()+"</pre>"        
        let html=this.logger.reportHtml()
        this.tabs.getTabDivById("log").fontFamily("monospace")
        this.tabs.setContent("log",html)
    }

    nlog(li:Misc.Logitem){
        this.nlogger.log(li)        
        let html=this.nlogger.reportHtml()
        this.neurallogdiv.html(html)
    }

    logstr(str:string){
        this.log(new Misc.Logitem(str))
    }

    // create elements
    
    createEngineControlPanel(){
        this.econtrolpanel=new HTMLDivElement_()
        
        let startenginebutton=new HTMLButtonElement_().
            value(">").            
            onmousedown(this.startenginebuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).            
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let makeanalyzedmovebutton=new HTMLButtonElement_().
            value("*").            
            onmousedown(this.makeanalyzedmovebuttonpressed.bind(this,false)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let makeandstoreanalyzedmovebutton=new HTMLButtonElement_().
            value("*!").            
            onmousedown(this.makeanalyzedmovebuttonpressed.bind(this,true)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let stopenginebutton=new HTMLButtonElement_().
            value("_").            
            onmousedown(this.stopenginebuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let restartenginebutton=new HTMLButtonElement_().
            value("!").            
            onmousedown(this.restartenginebuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let connectenginebutton=new HTMLButtonElement_().
            value("Connect").            
            onmousedown(this.connectenginebuttonpressed.bind(this))
        let rndbutton=new HTMLButtonElement_().
            value("Rnd").            
            onmousedown(this.rndbuttonpressed.bind(this))
        let anchorbutton=new HTMLButtonElement_().
            value("A").            
            onmousedown(this.anchorbuttonpressed.bind(this))
        let restorebutton=new HTMLButtonElement_().
            value("<-").            
            onmousedown(this.restorebuttonpressed.bind(this))
        this.pastetext=new HTMLInputElement_()
        this.pastetext.widthPx(40)
        this.econtrolpanel.appendChilds([
            startenginebutton,
            makeanalyzedmovebutton,
            makeandstoreanalyzedmovebutton,
            stopenginebutton,
            restartenginebutton,
            connectenginebutton,
            rndbutton,
            anchorbutton,
            restorebutton,
            this.pastetext
        ])
    }
    createControlPanel(){
        this.controlpanel=new HTMLDivElement_()        
        this.variantcombo=new ComboBox_().
            setOptions(Config.variantToDisplayName).
            setSelected(this.state.hasVariant()?this.state._variant:"standard").
            onChange(this.variantChanged.bind(this))
        let flipbutton=new HTMLButtonElement_().
            value("F").
            onmousedown(this.flipbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH"))
        let resetbutton=new HTMLButtonElement_().
            value("R").
            onmousedown(this.resetbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH"))
        let tobeginbutton=new HTMLButtonElement_().
            value("|<").
            onmousedown(this.tobeginbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let backbutton=new HTMLButtonElement_().
            value("<").
            onmousedown(this.backbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let forwardbutton=new HTMLButtonElement_().
            value(">").
            onmousedown(this.forwardbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH"))
        let toendbutton=new HTMLButtonElement_().
            value(">|").
            onmousedown(this.toendbuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        let deletebutton=new HTMLButtonElement_().
            value("X").
            onmousedown(this.deletebuttonpressed.bind(this)).
            widthPx(this.config.getPx("CONTROL_BUTTON_WIDTH")).
            paddingLeftPx(this.config.getPx("CONTROL_BUTTON_PADDING_LEFT"))
        this.saninputtext=new HTMLInputElement_()
        this.saninputtext.widthPx(50)
        let makesanbutton=new HTMLButtonElement_().
            value("M").            
            onmousedown(this.makesanbuttonpressed.bind(this))
        let setfromfenbutton=new HTMLButtonElement_().
            value("F").            
            onmousedown(this.setfromfenbuttonpressed.bind(this))
        let setfrompgnbutton=new HTMLButtonElement_().
            value("P").            
            onmousedown(this.setfrompgnbuttonpressed.bind(this))
        this.controlpanel.appendChilds([
            this.variantcombo,
            flipbutton,
            resetbutton,
            tobeginbutton,
            backbutton,
            forwardbutton,
            toendbutton,
            deletebutton,
            this.saninputtext,
            makesanbutton,
            setfromfenbutton,
            setfrompgnbutton
        ])
    }
    createTabs(){
        this.tabs=new TabPane_(
            "tabs",
            Config.PREFERRED_TAB_SIZE,
            Config.TOTAL_BOARD_HEIGHT,
            [
                new Tab("pgn","Pgn"),
                new Tab("book","Book"),            
                new Tab("neural","Neural"),
                new Tab("moves","Moves"),            
                new Tab("engine","Engine"),
                new Tab("game","Game"),            
                new Tab("bracket","Bracket"),            
                new Tab("players","Players"),            
                new Tab("setup","Setup"),
                new Tab("config","Config"),
                new Tab("src","Src"),            
                new Tab("log","Log")
            ]
        )

        this.createPgnDiv()
        this.tabs.setElement_("pgn",this.pgndiv)

        this.createEngineDiv()
        this.tabs.setElement_("engine",this.enginediv)

        this.createBookDiv()
        this.tabs.setElement_("book",this.bookdiv)

        this.createNcontrolDiv()
        this.tabs.setElement_("neural",this.ncontroldiv)

        this.createGameDiv()
        this.tabs.setElement_("game",this.gamediv)

        this.tabs.setElement_("players",this.players.createElement())

        this.tabs.setElement_("setup",this.setup.createElement())

        this.createConfigDiv()
        this.tabs.setElement_("config",this.configdiv)

        this.createBracketDiv()
        this.tabs.setElement_("bracket",this.bracketdiv)

        this.createSrcDiv()
        this.tabs.setElement_("src",this.srcdiv)
    }
    createEngineDiv(){
        this.enginediv=new HTMLDivElement_
        this.enginediv.fontFamily("monospace")
    }
    createPgnDiv(){
        this.pgndiv=new HTMLDivElement_
        this.pgntext=new HTMLTextAreaElement_()
        this.pgntext.
            widthPx(Config.PREFERRED_TAB_SIZE-25).
            heightPx(Config.TOTAL_BOARD_HEIGHT-65)
        this.pgnkeytext=new HTMLInputElement_
        this.pgnvaluetext=new HTMLInputElement_        
        this.pgnvaluetext.widthPx(465)
        let pgneditbutton=new HTMLButtonElement_().
            value("Edit").
            onmousedown(this.pgneditbuttonpressed.bind(this))
        this.pgndiv.appendChild(new HTMLLabelElement_().setText("Header name:").
            backgroundColor(this.LABEL_BCOL).            
            paddingPx(this.config.getPx("PADDING"))
        )
        this.pgndiv.appendChild(this.pgnkeytext)
        this.pgndiv.appendChild(new HTMLLabelElement_().setText("Header value:").
            backgroundColor(this.LABEL_BCOL).
            paddingPx(this.config.getPx("PADDING"))
        )
        this.pgndiv.appendChild(this.pgnvaluetext)
        this.pgndiv.appendChild(pgneditbutton)
        this.pgndiv.appendChild(this.pgntext)
    }
    appConfigText():string{
        return JSON.stringify(this.appconfig,null,1)
    }
    createConfigDiv(){
        let stored=localStorage.getItem("appconfig")
        if(Misc.isDefined(stored)){
            this.appconfig=JSON.parse(stored)
        }
        this.appconfig=Misc.updateObjectWith(this.appconfig,Config.appConfig)
        this.configdiv=new HTMLDivElement_()        
        this.configtext=new HTMLTextAreaElement_().setText(this.appConfigText())
        this.configtext.
            widthPx(Config.PREFERRED_TAB_SIZE-25).
            heightPx(Config.TOTAL_BOARD_HEIGHT-65)
        let configapplybutton=new HTMLButtonElement_().
            value("Apply").
            onmousedown(this.configapplybuttonpressed.bind(this))                
        this.configdiv.appendChilds([
            configapplybutton,
            this.configtext
        ])
    }
    createBookDiv(){
        this.bookdiv=new HTMLDivElement_()        
        let addmovebutton=new HTMLButtonElement_().
            value("+ M").
            onmousedown(this.addmovebuttonpressed.bind(this,false,false,null))
        let addmovebackbutton=new HTMLButtonElement_().
            value("+ M <").
            onmousedown(this.addmovebuttonpressed.bind(this,true,false,null))
        let delbookmovebutton=new HTMLButtonElement_().
            value("- M <").
            onmousedown(this.addmovebuttonpressed.bind(this,true,true,null))
        let delallmovesbutton=new HTMLButtonElement_().
            value("- P").
            onmousedown(this.delallmovesbuttonpressed.bind(this))
        let exportbookbutton=new HTMLButtonElement_().
            value("Export").
            onmousedown(this.exportbookbuttonpressed.bind(this))
        let importbookbutton=new HTMLButtonElement_().
            value("Import").
            onmousedown(this.importbookbuttonpressed.bind(this))
        let filechooser=new FileChooser("bookfilechooser_"+this.state._variant,this.dialogroot).
            setSaveCallback(this.savebookcallback.bind(this)).
            setLoadCallback(this.loadbookcallback.bind(this)).
            build()
        this.bookdiv.appendChilds([
            addmovebutton,
            addmovebackbutton,
            delbookmovebutton,
            delallmovesbutton,
            exportbookbutton,
            importbookbutton,
            filechooser
        ])
        this.bookcontentdiv=new HTMLDivElement_()
        this.bookdiv.appendChild(this.bookcontentdiv)
    }
    createNcontrolDiv(){
        this.ncontroldiv=new HTMLDivElement_()
        let issuelabel=new HTMLLabelElement_().setText("Enter neural command : ")
        this.nissuetext=new HTMLInputElement_()
        this.nissuetext.
            setEnterCallback(this.neuralissuebuttonpressed.bind(this)).
            widthPx(100)            
        let neuralissuebutton=new HTMLButtonElement_().
            value("Issue").            
            onmousedown(this.neuralissuebuttonpressed.bind(this))            
        let moveoncebutton=new HTMLButtonElement_().
            value("Move once").            
            onmousedown(this.moveonce.bind(this))            
        let gameoncebutton=new HTMLButtonElement_().
            value("Game once").            
            onmousedown(this.gameonce.bind(this))            
        let trainbutton=new HTMLButtonElement_().
            value("Train").            
            onmousedown(this.train.bind(this))            
        let stoptrainbutton=new HTMLButtonElement_().
            value("Stop").            
            onmousedown(this.stoptrain.bind(this))            
        let testneuralbutton=new HTMLButtonElement_().
            value("Test").            
            onmousedown(this.testneural.bind(this))            
        let reloadneuralbutton=new HTMLButtonElement_().
            value("Reload").            
            onmousedown(this.reloadneural.bind(this))            
        this.neurallogdiv=new HTMLDivElement_().
            widthPx(Config.PREFERRED_TAB_SIZE-35).
            heightPx(Config.TOTAL_BOARD_HEIGHT-70).
            overflow("scroll").
            fontFamily("monospace").
            backgroundColor("#fef")
        this.ncontroldiv.appendChilds([
            issuelabel,
            this.nissuetext,
            neuralissuebutton,
            moveoncebutton,
            gameoncebutton,
            trainbutton,
            stoptrainbutton,
            testneuralbutton,
            reloadneuralbutton,            
            this.neurallogdiv            
        ])
    }
    createGameDiv(){
        this.gamediv=new HTMLDivElement_()
        let gameidlabel=new HTMLLabelElement_().setText("Lichess game id : ")
        this.gameidtext=new HTMLInputElement_()
        this.gameidtext.widthPx(300)
        let gameloadbutton=new HTMLButtonElement_().
            value("Load").            
            onmousedown(this.gameloadbuttonpressed.bind(this))            
        this.gamediv.appendChilds([
            gameidlabel,
            this.gameidtext,
            gameloadbutton
        ])
    }
    createBracketDiv(){
        this.bracketdiv=new HTMLDivElement_()        
    }
    createSrcDiv(){
        this.srcdiv=new HTMLDivElement_
        this.srctext=new HTMLTextAreaElement_()
        this.srctext.
            widthPx(Config.PREFERRED_TAB_SIZE-25).
            heightPx(Config.TOTAL_BOARD_HEIGHT-45)
        this.srcdiv.appendChild(this.srctext)
    }

    startup:any
    startupdone:boolean=false

    evalsasset:AjaxAsset
    evals:any

    draw(){
        //////////////////////////////////////////////////////////

        this.root.html("")

        //////////////////////////////////////////////////////////

        this.logger=new Misc.Logger()        
        this.nlogger=new Misc.Logger()        

        //////////////////////////////////////////////////////////

        this.root.
            html("")

        //////////////////////////////////////////////////////////
        // table

        let table=new HTMLTableElement_().
            borderCollapse("separate").
            borderSpacingPx(6).
            borderPx(3).
            borderStyle("solid").
            borderColor("#dfdfdf").
            marginPx(5).
            backgroundColor("#efefef")

        let tr1=new HTMLTableRowElement_()        
        let tr2=new HTMLTableRowElement_()
        let tr3=new HTMLTableRowElement_()

        table.appendChilds([tr1,tr2,tr3])

        let td11=new HTMLTableColElement_()
        let td12=new HTMLTableColElement_().verticalAlign("top")       
        
        tr1.appendChilds([td11,td12])      

        let td21=new HTMLTableColElement_()
        let td22=new HTMLTableColElement_()
        
        tr2.appendChilds([td21,td22])

        let td31=new HTMLTableColElement_()

        tr3.appendChilds([td31])

        //////////////////////////////////////////////////////////

        this.wboardroot=new HTMLDivElement_()
        td11.appendChild(this.wboardroot)

        this.createTabs()
        td12.appendChild(this.tabs)

        this.createControlPanel()
        td21.appendChild(this.controlpanel)        
        
        this.fentext=new HTMLInputElement_()
        this.fentext.widthPx(Config.PREFERRED_TAB_SIZE).fontFamily("monospace")
        td22.appendChild(this.fentext)

        this.createEngineControlPanel()        
        td31.appendChild(this.econtrolpanel)

        //////////////////////////////////////////////////////////

        this.analyzer=new Analysis.Analyzer()
        this.analyzer.log=this.log.bind(this)

        //////////////////////////////////////////////////////////

        this.bracket=new Bracket()
        this.bracket.load()

        //////////////////////////////////////////////////////////

        this.loadEvals()

        //////////////////////////////////////////////////////////

        setTimeout((e=>{
            wboard.setRoot(gui.wboardroot)    
            this.setVariant()            
            wboard.draw()            
            this.bracketdiv.appendChild(this.bracket.createElement())
            this.root.appendChild(table)                                
            this.root.appendChild(this.dialogroot)
            Globals.log=this.log.bind(this)            
            if(!this.startupdone){
                this.startupdone=true
                new AssetLoader().
                    add(Globals.startup).
                    setcallback(this.doStartup.bind(this)).
                    load()            
            }    
            setTimeout(this.systemWatch.bind(this),1000)
        }).bind(this),0)

        //////////////////////////////////////////////////////////
    }

    systemWatch(e:Event){
        let pastetext=this.pastetext.getText()
        if(pastetext!=""){
            this.pastetext.setText("")
            this.loadLichessGameById(pastetext)
        }
        setTimeout(this.systemWatch.bind(this),1000)
    }

    bracketjsonasset:TextAsset=new TextAsset("bracket.json")
    brackeJsonLoaded(){
        this.bracket.hidecontrols=true
        this.bracket.editmode=false
        this.bracket.load(this.bracketjsonasset.text)
    }
    doStartup(){
        try{
            this.startup=Globals.startup.asJson()
        }catch(e){
            console.log("info: no special startup instructions were detected")
            return
        }
        let su=this.startup            
        if(Misc.isDefined(su.selectedTab)){
            this.tabs.setSelected(su.selectedTab)
        }
        if(Misc.isDefined(su.setBracketJson)){
            if(su.setBracketJson){
                new AssetLoader().
                    add(this.bracketjsonasset).
                    setcallback(this.brackeJsonLoaded.bind(this)).
                    load()    
            }
        }
    }
    startDefaultEngine(){
        let defaultengine=this.setup.defaultengines[this.state._variant]        
        if(defaultengine!="[None]"){
            this.analyzer.startengine(defaultengine)
        }
    }
    setVariant(variant:string=this.state._variant):boolean{
        if(!Misc.isDefined(variant)) variant="standard"
        if(!Config.isSupportedVariant(variant)) return false     
        this.analyzer.stopanalysis()   
        this.variantcombo.setSelected(variant)
        this.state.variant=variant
        Globals.wboard.dosetVariant(variant,false)
        if(this.state.hasPgn()){            
            Globals.wboard.dosetFromPgn(this.state._pgn)
        }        
        this.book=new Book(this.state._variant,"default")
        Globals.wboard.draw()
        this.startDefaultEngine()
        this.createBookDiv()
        this.tabs.setElement_("book",this.bookdiv)
        return true
    }
    variantChanged(e:Event){
        let t=<any>e.target
        let variant=t.selectedOptions[0].value        
        this.setVariant(variant)
    }    
    flipbuttonpressed(e:Event){
        Globals.wboard.doflip()
    }
    resetbuttonpressed(e:Event){
        Globals.wboard.doreset()
    }
    tobeginbuttonpressed(e:Event){
        Globals.wboard.dotobegin()
    }
    backbuttonpressed(e:Event){
        Globals.wboard.doback()
    }
    forwardbuttonpressed(e:Event){
        Globals.wboard.doforward()
    }
    toendbuttonpressed(e:Event){
        Globals.wboard.dotoend()
    }
    deletebuttonpressed(e:Event){
        Globals.wboard.dodelete()
    }
    makesanbuttonpressed(e:Event){
        let san=this.saninputtext.getText()
        this.saninputtext.setText("")
        Globals.wboard.domakeSanMove(san)
    }
    setfromfenbuttonpressed(e:Event){
        let fen=this.fentext.getText()        
        Globals.wboard.dosetFromFen(fen)
    }
    setfrompgnbuttonpressed(e:Event){
        let pgn=this.pgntext.getText()        
        Globals.wboard.dosetFromPgn(pgn)
    }
    pgneditbuttonpressed(e:Event){
        let key=this.pgnkeytext.getText()        
        this.pgnkeytext.setText("")
        let value=this.pgnvaluetext.getText()        
        this.pgnvaluetext.setText("")
        Globals.wboard.doeditPgn(key,value)
    }
    oldtabid:string=null
    startenginebuttonpressed(e:Event){
        this.oldtabid=this.tabs.selid
        this.analyzer.analyze()
    }
    positionChanged(){
        if(this.analyzer.enginerunning){
            this.analyzer.stopanalysis()
            this.analyzer.analyze()
        }
    }
    makeanalyzedmovebuttonpressed(store:boolean,e:Event){        
        this.analyzer.makeanalyzedmove()
        if(store){
            this.addmovebuttonpressed.bind(this,false,false,"!")()
        }
        this.positionChanged()
    }
    stopenginebuttonpressed(e:Event){
        this.analyzer.stopanalysis()                
        if(this.oldtabid!=null) Globals.gui.tabs.setSelected(this.oldtabid)
    }
    restartenginebuttonpressed(e:Event){
        this.startDefaultEngine()
    }
    connectenginebuttonpressed(e:Event){
        this.analyzer.connect()
    }
    addmovebuttonpressed(back:boolean,del:boolean,annotkey:string,e:Event){        
        let san=Globals.wboard.reportLastMoveSan()               
        if(san!=""){
            if(back) Globals.wboard.doback(); else Globals.wboard.back()
            let fen=Globals.wboard.reportFen()            
            if(!back) Globals.wboard.forward()
            let pos=this.book.getPosition(fen)
            let move=pos.getMove(san)
            if(annotkey!=null) move.setAnnot(BookUtils.annotations[annotkey])
            if(del) pos.delMove(san)
            this.book.store()
            Globals.wboard.draw()
        }
    }
    delallmovesbuttonpressed(e:Event){
        let fen=Globals.wboard.reportFen()
        this.book.delPosition(fen)
        this.book.store()
        Globals.wboard.draw()
    }
    importbookbuttonpressed(e:Event){
        let src=this.srctext.getText()
        this.book.fromJsonText(src)
        this.book.store()
        Globals.wboard.showBookPage()
    }
    exportbookbuttonpressed(e:Event){
        this.srctext.setText(this.book.src())
        this.tabs.setSelected("src")
    }
    rndon:boolean=false
    makerandom(){
        if(this.rndon){
            if(Globals.wboard.makeRandomMove()) setTimeout(this.makerandom.bind(this),100)
            else this.rndon=false
        }
    }
    rndbuttonpressed(e:Event){
        if(this.rndon){
            this.rndon=false
        } else {
            this.rndon=true
            this.makerandom()
        }
    }    
    anchorbuttonpressed(e:Event){
        Globals.wboard.latestpgn=Globals.wboard.reportPgn()
    }    
    restorebuttonpressed(e:Event){
        Globals.wboard.dosetFromPgn(Globals.wboard.latestpgn)
    } 
    ongameload(lg:LichessGame){        
        this.log(lg.okLogitem())

        let variant=lg.getHeader("GameVariant")
        if(!this.setVariant(variant)){
            this.log(new Misc.Logitem("error setting up game: unsupported variant "+variant).error())
            return
        }

        let moves=lg.moves
        this.logstr(moves)        
        Globals.wboard.setFromPgn(moves)

        for(let key in lg.pgnHeaders){
            let value=lg.getHeader(key)
            Globals.wboard.editPgn(key,value)
        }

        Globals.wboard.setUpGame()

        Globals.wboard.draw()

        this.pastetext.blur()

        this.tabs.setSelected("pgn")

        let ogl=this.appconfig.onGameLoad

        let fw=ogl.forwardMoves
        if(fw){
            for(let i=0;i<fw;i++) Globals.wboard.doforward()
        }

        if(ogl.autoStartEngine){
            setTimeout(e=>this.analyzer.analyze(),ogl.autoStartEngineTimeout)
        }
    }
    gameloaderror(lg:LichessGame){        
        this.log(lg.errorLogitem())
        let storedlg=this.bracket.lichessgameregistry[lg.gameid]
        if(storedlg!=undefined){
            this.log(lg.localAvailableLogitem())
            this.ongameload(storedlg)
        }
    }
    loadLichessGameById(gameid:string){        
        let lg=new LichessGame(gameid)

        this.tabs.setSelected("log")        
        this.log(lg.infoLogitem())

        lg.loadThen(
            this.ongameload.bind(this,lg),
            this.gameloaderror.bind(this,lg)
        )
    }
    gameloadbuttonpressed(e:Event){
        let gameid=this.gameidtext.getText()        
        this.gameidtext.setText("")        
        this.loadLichessGameById(gameid)
    }    
    savebookcallback(fcstate:FileChooserState){
        let fullpath=fcstate.fullpath()  
        let src=this.book.src()
        let ajaxasset=new AjaxAsset({
            action:"writetextfile",
            path:fullpath,
            content:src
        })
        new AssetLoader().
            add(ajaxasset).        
            load()                   
    }
    bookloadedcallback(ajaxasset:AjaxAsset){
        let result=ajaxasset.resjson               
        if(!result.error){
            this.srctext.setText(result.content)
            this.tabs.setSelected("src")
        }
    }
    loadbookcallback(fcstate:FileChooserState){
        let fullpath=fcstate.fullpath()          
        let ajaxasset=new AjaxAsset({
            action:"readtextfile",
            path:fullpath
        })
        new AssetLoader().
            add(ajaxasset).        
            setcallback(this.bookloadedcallback.bind(this,ajaxasset)).
            load()                   
    }
    configapplybuttonpressed(e:Event){
        let jsontext=this.configtext.getText()
        try{
            this.appconfig=JSON.parse(jsontext)
            localStorage.setItem("appconfig",jsontext)
            this.createConfigDiv()
            this.tabs.setElement_("config",this.configdiv)
        }catch(e){

        }
    }
    neuralissuebuttonpressed(e:Event){
        let command=this.nissuetext.getText()
        this.nissuetext.setText("")
        this.analyzer.issueneural(command)
    }    
    sendfens(e:Event):boolean{        
        let fens=Globals.wboard.legalFens()                
        if(fens.length<1) return false
        let json={action:"playmove",fens:fens}
        let jsonstr=JSON.stringify(json)        
        this.analyzer.issueneural(jsonstr)
        return true
    }
    trainon:boolean=false
    moveonceon:boolean=false
    gameonceon:boolean=false
    maketrainmove(){        
        this.analyzer.stopanalysis()
        let evals=this.getEvals()        
        let fen=Globals.wboard.reportFen()
        let to=this.analyzer.thinkingoutput
        let score=to.scoreNumerical()        
        let san=this.analyzer.makeanalyzedmove()
        evals[fen]={
            san:san,
            score:score,
            depth:to.depth
        }
        if(!this.trainon) return        
        if(!this.sendfens(null)){
            if(this.gameonceon||this.moveonceon){                
                this.gameonceon=false
                this.moveonceon=false
                this.stoptrain(null)
            }else{
                this.saveEvals()
                setTimeout(this.train.bind(this,null),1000)            
            }
        }
    }
    starttrainmove(){
        if(!this.trainon) return
        this.analyzer.analyze(false)
        setTimeout(this.maketrainmove.bind(this),500)
    }
    train(e:Event){
        Globals.wboard.doreset()
        this.trainon=true
        this.starttrainmove()
    }
    stoptrain(e:Event){
        this.trainon=false
        this.saveEvals()
    }
    makeneuralsan(json){
        let san=json.san
        Globals.wboard.domakeSanMove(san)
        if(this.moveonceon){            
            this.moveonceon=false
            this.stoptrain(null)
        }else{
            this.analyzer.waitbestmove(this.starttrainmove.bind(this))
        }
    }
    evalsLoaded(){        
        let res=this.evalsasset.resjson
        if(!res.error){
            this.evals=JSON.parse(res.content)
            for(let fen in this.evals){
                if(fen.lastIndexOf(" b")>0){
                    delete this.evals[fen]
                }
            }
        }
    }
    loadEvals(){
        this.evalsasset=new AjaxAsset({
            action:"readtextfile",
            path:"evals.json"
        })
        new AssetLoader().
            add(this.evalsasset).        
            setcallback(this.evalsLoaded.bind(this)).
            load()                   
    }
    getEvals():any{
        if(this.evals==undefined) this.evals={}
        return this.evals
    }
    saveEvalsDone(){
        this.analyzer.issueneural(JSON.stringify({
            action:"epoch",
            n:3
        }))
    }
    saveEvals(){
        let saveevalsasset=new AjaxAsset({
            action:"writetextfile",
            path:"evals.json",
            content:JSON.stringify(this.evals,null,1)
        })
        new AssetLoader().
            add(saveevalsasset).     
            setcallback(this.saveEvalsDone.bind(this)).
            load()                   
    }
    moveonce(e:Event){
        this.trainon=true
        this.moveonceon=true
        this.starttrainmove()
    }
    gameonce(e:Event){
        this.trainon=true
        this.gameonceon=true
        this.train(null)
    }
    testneural(e:Event){
        this.analyzer.issueneuralJson({action:"test"})
    }
    reloadneural(e:Event){
        this.analyzer.issueneural("reloadneural")
    }    
}