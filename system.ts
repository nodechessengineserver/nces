namespace System {
const path_=require("path")

export function joinPaths(path1:string,path2:string):string{
    if(path1=="")return path2
    if(path1.substr(path1.length-1)=="/")return path1+path2
    return path1+"/"+path2
}

export function listDir(path:string,callback:(err,files)=>void){
    console.log(`listing directory ${path}`)    
    fs.readdir(path, (err, files) => {        
        console.log(err,files)
        if(err!=null){
            callback(err,[])
            return
        }
        callback(err,files.map(file=>{
            let fpath=joinPaths(path,file)
            let fstats={
                ok:true,
                name:file,
                isfile:true,
                isdir:false,
                stats:{}
            }
            try{            
                let stats=fs.statSync(fpath)
                fstats.isfile=stats.isFile()
                fstats.isdir=stats.isDirectory()
                fstats.stats=stats
                //console.log(stats)
            }catch(err){
                console.log(`no stats for ${fpath}`)
                fstats.ok=false
            }
            return fstats
        }))
    })    
}

export function createDir(path:string,name:string,callback:(err,files)=>void){
    let fullpath=path+name
    console.log(`creating directory ${fullpath}`)
    fs.mkdir(fullpath,(err)=>{
        if(err) console.log(`failed creating ${fullpath}`)
        listDir(path,callback)
    })
}

export function removeDir(path:string,name:string,callback:(err,files)=>void){
    let fullpath=path+name
    console.log(`removing directory ${fullpath}`)
    fs.rmdir(fullpath,(err)=>{
        if(err) console.log(`failed removing ${fullpath}`)
        listDir(path,callback)
    })
}

export function writeTextFile(path:string,content:string,callback:(err)=>void){
    console.log(`writing text file ${path}`)        
    fs.writeFile(path, content, function(err) {
        if(err) {
            console.log(err)
            callback(err)
            return
        }
        console.log(`written ${content.length} characters`)
        callback(err)
    })
}

export function readTextFile(path:string,callback:(err,data)=>void){
    console.log(`reading text file ${path}`)        
    fs.readFile(path, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log(`read ${data.length} characters`);
            callback(err,data)
        } else {
            console.log(err)
            callback(err,data)
        }
    })
}

export function copyFile(pathFrom:string,pathTo:string,callback:(err)=>void){
    console.log(`copying file ${pathFrom} -> ${pathTo}`)        
    fs.copyFile(pathFrom, pathTo, function(err){
        if (!err) {
            console.log(`file copied ok`);
            callback(err)
        } else {
            console.log(`error: copying file failed`);
            console.log(err)
            callback(err)
        }
    })
}

export function moveFile(pathFrom:string,pathTo:string,callback:(err)=>void){
    console.log(`moving file ${pathFrom} -> ${pathTo}`)        
    copyFile(pathFrom,pathTo,err=>{
        if(!err){
            deleteFile(pathFrom,err=>{
                callback(err)
            })
        } else {
            callback(err)
        }
    })
}

export function renameFile(pathFrom:string,pathTo:string,callback:(err)=>void){
    console.log(`renaming file ${pathFrom} -> ${pathTo}`)        
    fs.rename(pathFrom, pathTo, function(err){
        if (!err) {
            console.log(`file renamed ok`);
            callback(err)
        } else {
            console.log(`error: renaming file failed`);
            console.log(err)
            callback(err)
        }
    })
}

export function deleteFile(path:string,callback:(err)=>void){
    console.log(`deleting file ${path}`)        
    fs.unlink(path, function(err){
        if (!err) {
            console.log(`file deleted ok`);
            callback(err)
        } else {
            console.log(`error: deleting file failed`);
            console.log(err)
            callback(err)
        }
    })
}

export function updateVersion(){
    console.log("updating package.json version")
    let path=path_.join(___dirname,"package.json")
    System.readTextFile(path,(err,data)=>{
      if(err){
        console.log("failed: package.json could not be read")
        return
      }else{
        let pjson
        try{
          pjson=JSON.parse(data)
        }catch(e){
          console.log("fatal: package.json is not valid json")
          return
        }
        let version=pjson.version
        console.log("current version "+version)
        if((version==null)||((typeof version)!="string")){
          console.log("fatal: package version is not valid string")
          return
        }
        let parts=version.split(".")
        if(parts.length!=3){
            console.log("fatal: version format incorrect, wrong number of parts")
            return
        }
        let vnums=parts.map(part=>parseInt(part))                   
        if(vnums.some((value,index,array)=>{return (isNaN(value))||(value<0)||(Math.floor(value)!=value)})){
            console.log("fatal: version parts are not all natural numbers")
            return
        }
        let newversion=`${vnums[0]}.${vnums[1]}.${vnums[2]+1}`
        console.log("new version "+newversion)
        pjson.version=newversion
        let jsontext=JSON.stringify(pjson,null,2)
        console.log("writing new package.json")
        writeTextFile(path,jsontext,err=>{})
      }
    })
}

}