/**
 * Created by Vasiliy on 6/11/2016.
 */
function Server(io)
{
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
        socket.connectedToGame = false;

        /*** обработчики осуществляющие сессии ***/
        socket.on("userDisconnected", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                currItm.games[clientData.gameId].players[clientData.userId].setSessionTimer();
            }
        });

        socket.on("userConnect", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                var user = currItm.games[clientData.gameId].players[clientData.userId];
                user.socket = socket;
                clearTimeout(user.sessionTimautId);
            }
        });

        /*** ask_name ***/
        socket.on("initName", function(clientData)
        {
            if (currItm._checkIds(clientData))
            {
                currItm.games[clientData.gameId].players[clientData.userId].name = clientData.name;
            }
        });

        /*** lobby ***/
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
                currItm.games[clientData.gameId].gameStarted = true;
                currItm.games[clientData.gameId].players[clientData.userId].inGame = true;
                currItm.games[clientData.gameId].players[clientData.userId].initTank();
                currItm.games[clientData.gameId].dispatchToUsers("userList", currItm.games[clientData.gameId].getClientList());
            }
        });

        /*** lobby_screen ***/
        socket.on("getGameData", function()
        {
            socket.emit("gameList", currItm._getGamesList());
        });

        socket.on("gameChosen", function(gameId)
        {
            if (!socket.connectedToGame && currItm._checkGameId(gameId))
            {
                socket.connectedToGame = true;
                var userParam = {
                    gameId: gameId,
                    socket: socket
                };
                eventObj.dispatch("createUser", userParam);
            }
        });

        /*** create_lobby ***/
        socket.on("createGame", function(data)
        {
            if (!socket.connectedToGame)
            {
                console.log("Game created");
                socket.connectedToGame = true;
                var userParam = {
                    gameId: currItm._addGame(new Game(data, eventObj)),
                    socket: socket
                };
                eventObj.dispatch("createUser", userParam);
            }
        });
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

    /*** Методы ***/
    currItm._checkIds = function(idsObj)
    {
        if (idsObj != null && currItm._checkGameId(idsObj.gameId))
        {
            idsObj.userId = parseInt(idsObj.userId);
            return !isNaN(idsObj.userId) && currItm.games[idsObj.gameId].players[idsObj.userId] != undefined;
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
        for (var i = 0; i < game.players.length && game.players[i] == undefined; ++i) {}
        return i == game.players.length;
    };

    currItm._addGame = function(game)
    {
        for (var i = 0; i < currItm.games.length && currItm.games[i] != undefined; ++i){}
        currItm.gamesCount++;currItm.gamesCount++;
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