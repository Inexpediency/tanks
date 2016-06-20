/**
 * Created by Vasiliy on 6/8/2016.
 */

var constants = require("./server_constants.js").constants;
var http = require("./load_files.js").http;

http.listen(constants.PORT, function()
{
    var Server = require("./Server.js");
    require("./load_files.js")();
    console.log("start listen port " + constants.PORT);
    var io = require("./load_files.js").io;
    var server = new Server(io);
});