#! /usr/bin/env node
var ___dirname;
var System;
(function (System) {
    var path_ = require("path");
    function joinPaths(path1, path2) {
        if (path1 == "")
            return path2;
        if (path1.substr(path1.length - 1) == "/")
            return path1 + path2;
        return path1 + "/" + path2;
    }
    System.joinPaths = joinPaths;
    function listDir(path, callback) {
        console.log("listing directory " + path);
        fs.readdir(path, function (err, files) {
            console.log(err, files);
            if (err != null) {
                callback(err, []);
                return;
            }
            callback(err, files.map(function (file) {
                var fpath = joinPaths(path, file);
                var fstats = {
                    ok: true,
                    name: file,
                    isfile: true,
                    isdir: false,
                    stats: {}
                };
                try {
                    var stats = fs.statSync(fpath);
                    fstats.isfile = stats.isFile();
                    fstats.isdir = stats.isDirectory();
                    fstats.stats = stats;
                    //console.log(stats)
                }
                catch (err) {
                    console.log("no stats for " + fpath);
                    fstats.ok = false;
                }
                return fstats;
            }));
        });
    }
    System.listDir = listDir;
    function createDir(path, name, callback) {
        var fullpath = path + name;
        console.log("creating directory " + fullpath);
        fs.mkdir(fullpath, function (err) {
            if (err)
                console.log("failed creating " + fullpath);
            listDir(path, callback);
        });
    }
    System.createDir = createDir;
    function removeDir(path, name, callback) {
        var fullpath = path + name;
        console.log("removing directory " + fullpath);
        fs.rmdir(fullpath, function (err) {
            if (err)
                console.log("failed removing " + fullpath);
            listDir(path, callback);
        });
    }
    System.removeDir = removeDir;
    function writeTextFile(path, content, callback) {
        console.log("writing text file " + path);
        fs.writeFile(path, content, function (err) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            console.log("written " + content.length + " characters");
            callback(err);
        });
    }
    System.writeTextFile = writeTextFile;
    function readTextFile(path, callback) {
        console.log("reading text file " + path);
        fs.readFile(path, { encoding: 'utf-8' }, function (err, data) {
            if (!err) {
                console.log("read " + data.length + " characters");
                callback(err, data);
            }
            else {
                console.log(err);
                callback(err, data);
            }
        });
    }
    System.readTextFile = readTextFile;
    function copyFile(pathFrom, pathTo, callback) {
        console.log("copying file " + pathFrom + " -> " + pathTo);
        fs.copyFile(pathFrom, pathTo, function (err) {
            if (!err) {
                console.log("file copied ok");
                callback(err);
            }
            else {
                console.log("error: copying file failed");
                console.log(err);
                callback(err);
            }
        });
    }
    System.copyFile = copyFile;
    function moveFile(pathFrom, pathTo, callback) {
        console.log("moving file " + pathFrom + " -> " + pathTo);
        copyFile(pathFrom, pathTo, function (err) {
            if (!err) {
                deleteFile(pathFrom, function (err) {
                    callback(err);
                });
            }
            else {
                callback(err);
            }
        });
    }
    System.moveFile = moveFile;
    function renameFile(pathFrom, pathTo, callback) {
        console.log("renaming file " + pathFrom + " -> " + pathTo);
        fs.rename(pathFrom, pathTo, function (err) {
            if (!err) {
                console.log("file renamed ok");
                callback(err);
            }
            else {
                console.log("error: renaming file failed");
                console.log(err);
                callback(err);
            }
        });
    }
    System.renameFile = renameFile;
    function deleteFile(path, callback) {
        console.log("deleting file " + path);
        fs.unlink(path, function (err) {
            if (!err) {
                console.log("file deleted ok");
                callback(err);
            }
            else {
                console.log("error: deleting file failed");
                console.log(err);
                callback(err);
            }
        });
    }
    System.deleteFile = deleteFile;
    function updateVersion() {
        console.log("updating package.json version");
        var path = path_.join(___dirname, "package.json");
        System.readTextFile(path, function (err, data) {
            if (err) {
                console.log("failed: package.json could not be read");
                return;
            }
            else {
                var pjson = void 0;
                try {
                    pjson = JSON.parse(data);
                }
                catch (e) {
                    console.log("fatal: package.json is not valid json");
                    return;
                }
                var version = pjson.version;
                console.log("current version " + version);
                if ((version == null) || ((typeof version) != "string")) {
                    console.log("fatal: package version is not valid string");
                    return;
                }
                var parts = version.split(".");
                if (parts.length != 3) {
                    console.log("fatal: version format incorrect, wrong number of parts");
                    return;
                }
                var vnums = parts.map(function (part) { return parseInt(part); });
                if (vnums.some(function (value, index, array) { return (isNaN(value)) || (value < 0) || (Math.floor(value) != value); })) {
                    console.log("fatal: version parts are not all natural numbers");
                    return;
                }
                var newversion = vnums[0] + "." + vnums[1] + "." + (vnums[2] + 1);
                console.log("new version " + newversion);
                pjson.version = newversion;
                var jsontext = JSON.stringify(pjson, null, 2);
                console.log("writing new package.json");
                writeTextFile(path, jsontext, function (err) { });
            }
        });
    }
    System.updateVersion = updateVersion;
})(System || (System = {}));
var Engine = /** @class */ (function () {
    function Engine() {
        this.name = "";
        this.path = "";
        this.config = "";
    }
    Engine.prototype.fromJson = function (json) {
        this.name = json.name;
        this.path = json.path;
        this.config = json.config;
        return this;
    };
    return Engine;
}());
var Engines = /** @class */ (function () {
    function Engines() {
        this.engines = [];
    }
    Engines.prototype.fromJsonText = function (jsontext) {
        return this.fromJson(JSON.parse(jsontext));
    };
    Engines.prototype.fromJson = function (json) {
        var _this = this;
        this.engines = [];
        json.engines.map(function (engine) {
            var e = new Engine().fromJson(engine);
            _this.engines.push(e);
        });
        return this;
    };
    Engines.prototype.getIndexByName = function (name) {
        if (name == "")
            return -1;
        for (var i = 0; i < this.engines.length; i++) {
            if (this.engines[i].name == name)
                return i;
        }
        var ne = new Engine();
        ne.name = name;
        this.engines.push(ne);
        return this.engines.length - 1;
    };
    Engines.prototype.deleteByName = function (name) {
        var i = this.getIndexByName(name);
        if (i >= 0) {
            var newengines = [];
            for (var j = 0; j < this.engines.length; j++) {
                if (i != j)
                    newengines.push(this.engines[j]);
            }
            this.engines = newengines;
        }
    };
    return Engines;
}());
var Misc;
(function (Misc) {
    var fs = require("fs");
    var textFileAssetWithDefault = /** @class */ (function () {
        function textFileAssetWithDefault(_path, _default) {
            this.path = _path;
            this.default = _default;
        }
        textFileAssetWithDefault.prototype.get = function () {
            try {
                fs.openSync(this.path, 'r');
            }
            catch (err) {
                try {
                    fs.writeFileSync(this.path, this.default, 'utf8');
                }
                catch (err) {
                    console.log("could not write " + this.path);
                }
                return this.default;
            }
            return fs.readFileSync(this.path, 'utf8');
        };
        textFileAssetWithDefault.prototype.storeText = function (text) {
            try {
                fs.writeFileSync(this.path, text, 'utf8');
            }
            catch (err) {
                console.log("could not write " + this.path);
            }
        };
        textFileAssetWithDefault.prototype.storeJson = function (json) {
            this.storeText(JSON.stringify(json, null, 1));
        };
        return textFileAssetWithDefault;
    }());
    Misc.textFileAssetWithDefault = textFileAssetWithDefault;
})(Misc || (Misc = {}));
var Server;
(function (Server) {
    function setuphtml(e) {
        Globals.configasset.storeJson(Globals.engines);
        var enginescontent = Globals.engines.engines.map(function (engine) {
            return "<tr>\n            <td class=\"enginetd\">" + engine.name + "</td>\n            <td class=\"enginetd\">" + engine.path + "</td>\n            <td class=\"enginetd\"><pre>" + engine.config + "</pre></td>\n            <td class=\"enginetd\">\n                <form method=\"POST\" action=\"/doeditengine\">\n                <input type=\"hidden\" name=\"name\" value=\"" + engine.name + "\">\n                <input type=\"submit\" value=\"Edit\">\n                </form>\n            </td>\n            <td class=\"enginetd\">\n            <form method=\"POST\" action=\"/dodeleteengine\">\n            <input type=\"hidden\" name=\"name\" value=\"" + engine.name + "\">\n            <input type=\"submit\" value=\"Delete\">\n            </form>\n        </td>\n            </tr>";
        }).join("\n");
        var content = "\n        <form method=\"POST\" action=\"/editengine\">\n        <table>\n        <tr>\n        <td class=\"enginetd\">Name</td>\n        <td class=\"enginetd\">Path</td>\n        </tr>\n        <tr>\n        <td class=\"enginetd\"><input type=\"text\" name=\"name\" style=\"width:150px;font-family:monospace;\" value=\"" + e.name + "\"></td>\n        <td class=\"enginetd\"><input type=\"text\" name=\"path\" style=\"width:450px;font-family:monospace;\" value=\"" + e.path + "\"></td>        \n        </tr>\n        <tr>\n        <td class=\"enginetd\" colspan=\"2\">Config</td>        \n        </tr>\n        <tr>        \n        <td class=\"enginetd\" colspan=\"2\" align=\"middle\"><textarea style=\"width:600px;height:100px;\" name=\"config\">" + e.config + "</textarea></td>                \n        </tr>\n        </table>\n        <input type=\"submit\" style=\"margin-top:8px;\" value=\"Submit\">\n        </form>\n        <hr>\n        <table>\n        <tr>\n        <td class=\"enginetd\">Name</td>\n        <td class=\"enginetd\">Path</td>\n        <td class=\"enginetd\">Config</td>\n        <td class=\"enginetd\">Edit</td>\n        <td class=\"enginetd\">Delete</td>\n        </tr>\n        " + enginescontent + "\n        </table>\n        ";
        return content;
    }
    function indexsend(req, res, e) {
        res.send("\n        <html>\n        \n          <head>\n          \n            <link rel=\"stylesheet\" href=\"assets/stylesheets/reset.css\">\n\n            <style>\n                .enginetd {\n                    padding:5px;\n                    background-color:#efefef;\n                }\n                hr {\n                    padding:1px;\n                    margin:15px;\n                }\n            </style>\n            \n          </head>\n        \n          <body>\n\n            <div style=\"font-family:monospace;font-size:10px;padding-top:3px;padding-left:10px;\">\n            <a href=\"/\">Chess</a> | <a href=\"/enginesetup\">Engine setup</a>\n            </div>\n\n            " + (req.path == "/" ?
            "<script src=\"wasmboard.js\"></script>"
            :
                "<div style=\"padding:10px;margin:5px;background-color:#efefef;font-family:monospace;\">\n                " + setuphtml(e) + "</div>") + "\n\n            <script src=\"assets/javascripts/analytics.js\"></script>\n        \n          </body>\n        \n        </html>\n        ");
    }
    function indexhtml(req, res) {
        if (___dirname != __dirname) {
            res.sendFile(path_.join(___dirname, 'index.html'));
            return;
        }
        console.log(req.path);
        var e = new Engine();
        if (req.path == "/doeditengine") {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var i = Globals.engines.getIndexByName(fields.name);
                if (i >= 0) {
                    e = Globals.engines.engines[i];
                    indexsend(req, res, e);
                }
            });
        }
        else {
            indexsend(req, res, e);
        }
    }
    Server.indexhtml = indexhtml;
})(Server || (Server = {}));
var Globals;
(function (Globals) {
    Globals.engines = new Engines();
})(Globals || (Globals = {}));
/////////////////////////////////////////////////////////////
// imports
var formidable = require('formidable');
var http = require('http');
var express = require('express');
var WebSocket_ = require('ws');
var spawn = require("child_process").spawn;
var path_ = require("path");
var bodyParser = require('body-parser');
var fs = require("fs");
var opn = require('opn');
/////////////////////////////////////////////////////////////
___dirname = __dirname;
console.log("server directory " + ___dirname);
/////////////////////////////////////////////////////////////
// command line arguments
var startserver = true;
if (process.argv.length > 2) {
    var command = process.argv[2];
    if ((command == "--updateVersion") || (command == "-u")) {
        System.updateVersion();
        startserver = false;
    }
    else if ((command == "--dirname") || (command == "-d")) {
        if (process.argv.length > 3) {
            ___dirname = process.argv[3];
            console.log("files will be served from " + ___dirname);
        }
    }
}
Globals.configasset = new Misc.textFileAssetWithDefault(___dirname + "/config.json", "{\"engines\":[]}");
if (startserver)
    createServer();
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// server
function createServer() {
    var app = express();
    var server = http.createServer(app);
    var assetpath = path_.join(___dirname, ___dirname == __dirname ? 'wasmboard/assets' : 'assets');
    Globals.engines.fromJsonText(Globals.configasset.get());
    app.get('/', Server.indexhtml);
    if (___dirname != __dirname) {
        app.get('/gui.js', function (req, res) {
            res.sendFile(path_.join(___dirname, 'gui.js'));
        });
    }
    app.get('/enginesetup', Server.indexhtml);
    app.get('/wasmboard.js', function (req, res) {
        res.setHeader("Content-Type", "application/javascript");
        res.sendFile(path_.join(___dirname, 'wasmboard/wasmboard.js'));
    });
    app.get('/startup.json', function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.sendFile(path_.join(___dirname, 'wasmboard/startup.json'));
    });
    app.post('/editengine', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var i = Globals.engines.getIndexByName(fields.name);
            if (i >= 0) {
                Globals.engines.engines[i].path = fields.path;
                Globals.engines.engines[i].config = fields.config;
            }
            Server.indexhtml(req, res);
        });
    });
    app.post('/dodeleteengine', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            Globals.engines.deleteByName(fields.name);
            Server.indexhtml(req, res);
        });
    });
    app.post('/doeditengine', function (req, res) {
        Server.indexhtml(req, res);
    });
    app.use('/assets', express.static(assetpath));
    app.use('/ajax', bodyParser.json({ limit: '10mb' }));
    app.post("/ajax", function (req, res) {
        var action = req.body.action;
        console.log("ajax " + action);
        var b = req.body;
        res.setHeader("Content-Type", "application/json");
        if (action == "listdir") {
            System.listDir(b.path, function (err, files) {
                var result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "createdir") {
            System.createDir(b.path, b.name, function (err, files) {
                var result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "removedir") {
            System.removeDir(b.path, b.name, function (err, files) {
                var result = { err: err, files: files };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "writetextfile") {
            System.writeTextFile(b.path, b.content, function (err) {
                var result = { err: err };
                res.send(JSON.stringify(result));
            });
        }
        if (action == "readtextfile") {
            System.readTextFile(b.path, function (err, data) {
                var result = {
                    error: false,
                    content: ""
                };
                if (err) {
                    result.error = true;
                }
                else {
                    result.content = data;
                }
                res.send(JSON.stringify(result));
            });
        }
        if (action == "copyfile") {
            System.copyFile(b.pathFrom, b.pathTo, function (err) {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "movefile") {
            System.moveFile(b.pathFrom, b.pathTo, function (err) {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "renamefile") {
            System.renameFile(b.pathFrom, b.pathTo, function (err) {
                res.send(JSON.stringify(err));
            });
        }
        if (action == "deletefile") {
            System.deleteFile(b.path, function (err) {
                res.send(JSON.stringify(err));
            });
        }
    });
    var wss = new WebSocket_.Server({ server: server });
    var current_ws;
    var proc = null;
    function issueCommand(proc, command) {
        command += "\n";
        command = command.replace(new RegExp("\\n+", "g"), "\n");
        try {
            proc.stdin.write(command);
        }
        catch (err) {
            console.log("could not write command to process stdin");
            console.log(err);
        }
    }
    var nproc;
    var pythonpath = process.env.PYTHON_PATH + "\\python.exe";
    console.log("Python path: " + pythonpath);
    var neuralpypath = __dirname + "\\neural.py";
    console.log("neural.py path: " + neuralpypath);
    function sendNeural(data, dolog) {
        if (dolog === void 0) { dolog = false; }
        var str = data.toString().replace(new RegExp("[\r]", "g"), "");
        if (dolog)
            console.log(str);
        var lines = str.split("\n");
        try {
            lines.map(function (line) {
                if (line != "")
                    current_ws.send(JSON.stringify({ action: "neuraloutput", buffer: line }));
            });
        }
        catch (err) {
            //console.log("could not send neural output")
        }
    }
    function spawnNproc() {
        try {
            nproc.kill();
            console.log("terminated old neural");
        }
        catch (err) { }
        try {
            nproc = spawn(pythonpath, [neuralpypath]);
            nproc.on("error", function (err) {
                sendNeural(err, true);
            });
            nproc.stdout.on('data', function (data) {
                sendNeural(data, false);
            });
            nproc.stderr.on('data', function (data) {
                sendNeural(data, true);
            });
            console.log("neural started ok");
        }
        catch (err) {
            console.log("could not start neural");
        }
    }
    spawnNproc();
    wss.on('connection', function connection(ws) {
        current_ws = ws;
        ws.on('message', function incoming(message) {
            var mjson = JSON.parse(message);
            if (mjson.action != "issueneural") {
                console.log('received:', mjson);
            }
            if (mjson.action == "issueneural") {
                var command = mjson.command;
                if (command == "reloadneural") {
                    console.log("reloading neural");
                    spawnNproc();
                }
                else {
                    issueCommand(nproc, command);
                }
            }
            if (mjson.action == "sendavailable")
                ws.send("{\"action\":\"available\",\"available\":[" + Globals.engines.engines.map(function (engine) { return "\"" + engine.name + "\""; }).join(",") + "]}");
            if (mjson.action == "start") {
                var name_1 = mjson.name;
                var i = Globals.engines.getIndexByName(name_1);
                if (i >= 0) {
                    var e = Globals.engines.engines[i];
                    if (proc != null)
                        try {
                            proc.kill();
                        }
                        catch (err) {
                            console.log("could not kill process: " + proc);
                        }
                    try {
                        proc = spawn(e.path);
                    }
                    catch (err) {
                        console.log("could not start process: " + name_1 + " @ " + e.path);
                    }
                    if (e.config != "") {
                        issueCommand(proc, e.config);
                    }
                    try {
                        proc.stdout.on('data', function (data) {
                            var str = data.toString().replace(new RegExp("[\r]", "g"), "");
                            var lines = str.split("\n");
                            lines.map(function (line) {
                                if (line != "")
                                    current_ws.send("{\"action\":\"thinkingoutput\",\"buffer\":\"" + line + "\"}");
                            });
                        });
                    }
                    catch (err) {
                        console.log("could not add reader to process stdout");
                    }
                }
            }
            if (mjson.action == "issue") {
                var command = mjson.command.toString();
                issueCommand(proc, command);
            }
        });
    });
    server.listen(9000, function () {
        console.log("Node engine server started on port " + server.address().port);
    });
    opn("http://localhost:9000");
}
///////////////////////////////////////////////////////////// 
