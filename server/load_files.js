var fs = require("fs");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var constants = require("./server_constants.js").constants;
var ROOT_ADDRESS = constants.ROOT_ADDRESS;

function loadFile(path, fileName)
{
    var path = path;
    var fileName = fileName;
    app.get("/" + fileName, function(req, res)
    {
        res.sendFile(path + fileName);
    });
}

function loadDirectory(ROOT)
{
    var loadedDirectory = [];
    loadedDirectory[0] = ROOT;
    for (var j = 0; j < loadedDirectory.length; ++j)
    {
        var files = fs.readdirSync(loadedDirectory[j]);
        for (var i = 0; i < files.length; ++i)
        {
            var isFolder = (files[i].indexOf(".") > 0);
            if (isFolder)
            {
                loadFile(loadedDirectory[j], files[i]);
            }
            else
            {
                loadedDirectory[loadedDirectory.length] = loadedDirectory[j] + files[i] + "\\";
            }
        }
    }
}

function loadFiles()
{
    loadDirectory(ROOT_ADDRESS + "web\\");
    loadDirectory(ROOT_ADDRESS + "common\\");

    app.get("/", function(req, res)
    {
        res.sendFile(ROOT_ADDRESS + "web\\start_screen.html");
    });

    loadFile(ROOT_ADDRESS + "server/node_modules/socket.io/node_modules/socket.io-client/", "socket.io.js");
    console.log("Files loaded");
}

module.exports = loadFiles;
module.exports.http = http;
module.exports.io = io; 