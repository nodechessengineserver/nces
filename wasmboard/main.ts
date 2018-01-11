import gui=Globals.gui
import wboard=Globals.wboard

function main(){    
    gui.draw()
}

function mainloader(){    
    //localStorage.clear()
    new AssetLoader().
        add(wboard).
        setcallback(main).
        load()    
}

mainloader()