/**
 * Created by Vasiliy on 6/11/2016.
 */
function Server(io)
{
    var constants = require("../common/constants.js").constants;
    var eventObj = new require("../common/EventController.js")();
    var Client = require("./Client.js");
    var Game = require("./Game.js");
    var mapManager = new require("./MapManager.js")();

    this.games = [];
    this.gamesCount = 0;

    var currItm = this;

    /*** Инициализация подключения ***/
    io.on("connection", function(socket)
    {
        currItm.socketHandlers.session(socket);
        var fileName = currItm._getFileName(socket.handshake.headers.referer);
        if (currItm.socketHandlers[fileName] != undefined)
        {
            currItm.socketHandlers[fileName](socket);
        }
    });

    /*** Обработчики внутрисерверных событий ***/
    eventObj.listen("createUser", function(userParam)
    {
        var currGame = currItm.games[userParam.gameId];
        var client = new Client(currGame.playersEventObj);
        var id = currGame.addPlayer(client);
        if (id != null)
        {
            console.log("Client connect to game ", userParam.gameId);
            userParam.socket.connectedToGame = true;
            client.id = id;
            var gameData = {
                userId: id,
                gameId: userParam.gameId
            };
            userParam.socket.emit("dispatchId", gameData);
            io.sockets.emit("gameList", currItm._getGamesList());
        }
    });

    eventObj.listen("gameLived", function(gameId)
    {
        if (currItm._isGameEmpty(gameId))
        {
            currItm._delGame(gameId);
        }
    });

    eventObj.listen("gameChanged", function()
    {
        io.sockets.emit("gameList", currItm._getGamesList());
    });

    /*** Обработчики событий сокетов ***/
    currItm.socketHandlers = [];

    currItm.socketHandlers["lobby_screen"] = function(socket)
    {
        socket.on("getGameData", function()
        {
            socket.emit("gameList", currItm._getGamesList());
        });

        socket.on("gameChosen", function(gameId)
        {
            if (!socket.gameChosen)
            {
                socket.gameChosen = true;
                if (currItm._checkGameId(gameId))
                {
                    var userParam = {
                        gameId: gameId,
                        socket: socket
                    };
                    eventObj.dispatch("createUser", userParam);
                }
            }
        });
    };

    currItm.socketHandlers["create_lobby"] = function(socket)
    {
        socket.on("createGame", function(data)
        {
            if (!socket.gameCreated)
            {
                socket.gameCreated = true;
                console.log("Game created");
                data.field = mapManager.createMap(data.userCount);
                socket.connectedToGame = true;
                var userParam = {
                    gameId: currItm._addGame(new Game(data, eventObj)),
                    socket: socket
                };
                eventObj.dispatch("createUser", userParam);
            }
        });
    };

    currItm.socketHandlers["ask_name"] = function(socket)
    {
        socket.on("initName", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                currItm.games[clientData.gameId].tanks[clientData.userId].name = clientData.name;
            }
        });
    };

    currItm.socketHandlers["lobby"] = function(socket)
    {
        socket.on("getUsersList", function(gameId)
        {
            if (currItm._checkGameId(gameId))
            {
                currItm.games[gameId].dispatchToUsers("userList", currItm.games[gameId].getClientList());
            }
        });

        socket.on("getLobbyName", function(gameId)
        {
            if (currItm._checkGameId(gameId))
            {
                socket.emit("lobbyName", currItm.games[gameId].name);
            }
        });

        socket.on("joinGame", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                var currGame = currItm.games[clientData.gameId];
                var client = currGame.tanks[clientData.userId];
                if (!currGame.gameStarted)
                {
                    currGame.startGame();
                    currGame.gameStarted = true;
                }
                client.inGame = true;
                client.initTank(currGame.field);
                currGame.dispatchToUsers("userList", currGame.getClientList());
            }
        });
    };

    currItm.socketHandlers["index"] = function(socket)
    {
        var tank;

        socket.on("startDialog", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                tank = currItm.games[clientData.gameId].tanks[clientData.userId].tank;
            }
        });

        socket.on("moveTank", function(tankMotion)
        {
            if (typeof tank == "object" && tank != null)
            {
                tank.setMotion(tankMotion);
            }
        });

        socket.on("stopTank", function(tankMotion)
        {
            if (typeof tank == "object" && tankMotion == tank.motion && tank != null)
            {
                tank.motion = constants.NOTHING_CHAR;
            }
        });

        socket.on("moveTankHead", function(tankHeadMotion)
        {
            if (typeof tank == "object" && tank != null)
            {
                tank.setTowerMotion(tankHeadMotion);
            }
        });

        socket.on("fire", function(isFire)
        {
            if (typeof tank == "object" && tank != null)
            {
                tank.fire = isFire; //преобразование к boolean
            }
        });
    };

    currItm.socketHandlers["session"] = function(socket)
    {
        socket.on("userDisconnected", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                var user = currItm.games[clientData.gameId].tanks[clientData.userId];
                clearTimeout(user.sessionTimautId);
                user.setSessionTimer(constants.CLIENT_LIVE_TIME);
            }
        });

        socket.on("userConnect", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                var user = currItm.games[clientData.gameId].tanks[clientData.userId];
                clearTimeout(user.sessionTimautId);
                user.socket = socket;
                user.initHartBeet();
            }
        });
    };

    /*** Методы ***/
    currItm._getFileName = function(url)
    {
        var href = currItm._getHref(url);
        return href.substring(0, href.lastIndexOf("."));
    };

    currItm._getHref = function(url)
    {
        var lastPos = url.indexOf("?") >= 0 ? url.indexOf("?") : url.length;
        return url.substring(url.lastIndexOf("/") + 1, lastPos);
    };

    currItm._checkIds = function(idsObj)
    {
        if (idsObj != null && currItm._checkGameId(idsObj.gameId))
        {
            idsObj.userId = parseInt(idsObj.userId);
            return !isNaN(idsObj.userId) && currItm.games[idsObj.gameId].tanks[idsObj.userId] != undefined;
        }
        return false;
    };

    currItm._checkGameId = function(gameId)
    {
        gameId = parseInt(gameId);
        return !isNaN(gameId) && currItm.games[gameId] != undefined;
    };

    currItm._isGameEmpty = function(gameId)
    {
        var game = currItm.games[gameId];
        for (var i = 0; i < game.tanks.length && game.tanks[i] == undefined; ++i) {}
        return i == game.tanks.length;
    };

    currItm._addGame = function(game)
    {
        for (var i = 0; i < currItm.games.length && currItm.games[i] != undefined; ++i){}
        currItm.gamesCount++;
        currItm.games[i] = game;
        currItm.games[i].id = i;
        return i;
    };

    currItm._delGame = function(gameId)
    {
        console.log("Game " + gameId + " destroy");
        currItm.gamesCount--;
        delete currItm.games[gameId];
    };

    currItm._getGamesList = function()
    {
        var result = [];
        for (var i = 0; i < currItm.games.length; ++i)
        {
            if (currItm.games[i] != undefined)
            {
                result[i] = {};
                result[i].name = currItm.games[i].name;
                result[i].state = currItm.games[i].started;
                result[i].connectedUserCount = currItm.games[i].connectedUserCount;
                result[i].maxUserCount = currItm.games[i].userCount;
                result[i].id = currItm.games[i].id;
            }
        }

        return result;
    };

    return currItm;
}

module.exports = Server;