/////////////////////////////////////////////////////////////
// imports
var formidable = require('formidable');
const http=require('http');
const express=require('express');
const WebSocket_ = require('ws');
const { spawn } = require("child_process")
const path_=require("path")
const bodyParser = require('body-parser')
const fs=require("fs")
var opn=require('opn')
/////////////////////////////////////////////////////////////

___dirname=__dirname

console.log(`server directory ${___dirname}`)

/////////////////////////////////////////////////////////////
// command line arguments
let startserver:boolean=true

if(process.argv.length>2){
  let command=process.argv[2]
  if((command=="--updateVersion")||(command=="-u")){
    System.updateVersion()
    startserver=false
  } else if((command=="--dirname")||(command=="-d")){
    if(process.argv.length>3){
      ___dirname=process.argv[3]      
      console.log(`files will be served from ${___dirname}`)
    }
  }
}

Globals.configasset=new Misc.textFileAssetWithDefault(___dirname+"/config.json",`{"engines":[]}`)

if(startserver) createServer()
/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
// server
function createServer(){
const app = express();

const server = http.createServer(app);

let assetpath=path_.join(___dirname, ___dirname==__dirname?'wasmboard/assets':'assets')

Globals.engines.fromJsonText(Globals.configasset.get())

app.get('/', Server.indexhtml)
if(___dirname!=__dirname){
  app.get('/gui.js',function(req,res){
    res.sendFile(path_.join(___dirname, 'gui.js'))
  })
}
app.get('/enginesetup', Server.indexhtml)
app.get('/wasmboard.js',function(req,res){
  res.setHeader("Content-Type", "application/javascript")
  res.sendFile(path_.join(___dirname, 'wasmboard/wasmboard.js'))
})
app.get('/startup.json',function(req,res){
  res.setHeader("Content-Type", "application/json")
  res.sendFile(path_.join(___dirname, 'wasmboard/startup.json'))
})
app.post('/editengine',function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let i=Globals.engines.getIndexByName(fields.name)
    if(i>=0){
      Globals.engines.engines[i].path=fields.path
      Globals.engines.engines[i].config=fields.config
    }
    Server.indexhtml(req,res)
  })
})
app.post('/dodeleteengine',function(req,res){
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {    
    Globals.engines.deleteByName(fields.name)
    Server.indexhtml(req,res)
  })
})
app.post('/doeditengine',function(req,res){  
    Server.indexhtml(req,res)
})

app.use('/assets', express.static(assetpath))
app.use('/ajax',bodyParser.json({limit:'10mb'}))

app.post("/ajax",function(req,res){    
  let action=req.body.action  
  console.log(`ajax ${action}`)

  let b=req.body

  res.setHeader("Content-Type","application/json")
  
  if(action=="listdir"){
    System.listDir(b.path,(err,files)=>{
        let result={err:err,files:files}
        res.send(JSON.stringify(result))
    })    
  }  

  if(action=="createdir"){
    System.createDir(b.path,b.name,(err,files)=>{
        let result={err:err,files:files}
        res.send(JSON.stringify(result))
    })    
  }  

  if(action=="removedir"){
    System.removeDir(b.path,b.name,(err,files)=>{
        let result={err:err,files:files}
        res.send(JSON.stringify(result))
    })    
  }  
  
  if(action=="writetextfile"){
    System.writeTextFile(b.path,b.content,(err)=>{
      let result={err:err}
      res.send(JSON.stringify(result))
    })    
  }  

  if(action=="readtextfile"){
    System.readTextFile(b.path,(err,data)=>{
      let result={
        error:false,
        content:""
      }
      if(err){
        result.error=true
      }else{
        result.content=data
      }      
      res.send(JSON.stringify(result))
    })
  }  

  if(action=="copyfile"){
    System.copyFile(b.pathFrom,b.pathTo,(err)=>{
      res.send(JSON.stringify(err))
    })    
  }  

  if(action=="movefile"){
    System.moveFile(b.pathFrom,b.pathTo,(err)=>{
      res.send(JSON.stringify(err))
    })    
  }  

  if(action=="renamefile"){
    System.renameFile(b.pathFrom,b.pathTo,(err)=>{
      res.send(JSON.stringify(err))
    })    
  }  

  if(action=="deletefile"){
    System.deleteFile(b.path,(err)=>{
      res.send(JSON.stringify(err))
    })    
  }  
})

const wss = new WebSocket_.Server({ server });

let current_ws
let proc=null

function issueCommand(proc:any,command:string){
  command+="\n"
  command=command.replace(new RegExp("\\n+","g"),"\n")
  try{
    proc.stdin.write(command)
  }catch(err){
    console.log("could not write command to process stdin")
    console.log(err)
  }
}

let nproc

let pythonpath=process.env.PYTHON_PATH+"\\python.exe"
console.log("Python path: "+pythonpath)

let neuralpypath=__dirname+"\\neural.py"

console.log("neural.py path: "+neuralpypath)

function sendNeural(data,dolog:boolean=false){
  let str=data.toString().replace(new RegExp("[\r]","g"),"")    
  if(dolog) console.log(str)
  let lines=str.split("\n")
  try{
    lines.map(line=>{
      if(line!="")          
        current_ws.send(JSON.stringify({action:"neuraloutput",buffer:line}));
    })  
  }catch(err){
    //console.log("could not send neural output")
  }
}

function spawnNproc(){
  try{
    nproc.kill()
    console.log("terminated old neural")
  }catch(err){}

  try{
    nproc=spawn(pythonpath,[neuralpypath])    
    nproc.on("error",err=>{      
      sendNeural(err,true)
    })
    nproc.stdout.on('data', (data) => {         
      sendNeural(data,false)
    })
    nproc.stderr.on('data', (data) => {        
      sendNeural(data,true)
    })
    console.log("neural started ok")
  }catch(err){
    console.log("could not start neural")
  }  
}

spawnNproc()

wss.on('connection', function connection(ws) {
  current_ws=ws
  ws.on('message', function incoming(message) {
    let mjson=JSON.parse(message)
    if(mjson.action!="issueneural"){
      console.log('received:', mjson)
    }

    if(mjson.action=="issueneural"){
      let command=mjson.command      
      if(command=="reloadneural"){
        console.log("reloading neural")
        spawnNproc()
      }else{        
        issueCommand(nproc,command)
      }
    }    

    if(mjson.action=="sendavailable") ws.send(`{"action":"available","available":[${Globals.engines.engines.map(engine=>`"${engine.name}"`).join(",")}]}`);
    if(mjson.action=="start"){
      let name=mjson.name
      let i=Globals.engines.getIndexByName(name)
      if(i>=0){
        let e=Globals.engines.engines[i]        
        if(proc!=null) try{
          proc.kill()
        }catch(err){
          console.log(`could not kill process: ${proc}`)
        }        
        try{
          proc=spawn(e.path)                
        }catch(err){
          console.log(`could not start process: ${name} @ ${e.path}`)
        }
        if(e.config!=""){
          issueCommand(proc,e.config)
        }
        try{
          proc.stdout.on('data', (data) => {        
            let str=data.toString().replace(new RegExp("[\r]","g"),"")
            let lines=str.split("\n")
            lines.map(line=>{
              if(line!="")
                current_ws.send(`{"action":"thinkingoutput","buffer":"${line}"}`);
            })          
          })
        }catch(err){
          console.log(`could not add reader to process stdout`)
        }        
      }
    }
    if(mjson.action=="issue"){           
      let command=mjson.command.toString()
      issueCommand(proc,command)      
    }
  });
});

server.listen(9000, () => {
  console.log(`Node engine server started on port ${server.address().port}`);
});

opn("http://localhost:9000")

}

/////////////////////////////////////////////////////////////