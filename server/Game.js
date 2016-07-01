/**
 * Created by Vasiliy on 6/11/2016.
 */
function Game(data, eventObj)
{
    var constants = require("../common/constants.js").constants;
    var EventController = require("../common/EventController.js");
    var Field = require("./Field.js");

    this.tanks = [];
    this.connectedUserCount = 0;
    this.started = false;
    this.id = undefined;
    this.name = data.name == "" ? "no_name" : data.name;

    var userCount = parseInt(data.userCount);
    this.userCount = (!isNaN(userCount) && userCount > 1 && userCount < constants.MAX_PLAYERS_COUNT) ? userCount : constants.MAX_PLAYERS_COUNT;

    this.playersEventObj = new EventController();
    this.fieldEventObj = new EventController();
    this.field = new Field(data.field, this.fieldEventObj);
    this.gameIntervalId = null;

    var currItm = this;

    this.startGame = function()
    {
        this.field.init();
        currItm.startTime = new Date();
        this.gameIntervalId = setInterval(function()
        {
            currItm.field.refreshState();
            var data = currItm.field.getFieldState();
            data.time = currItm._getFullSeconds(currItm.startTime);
            currItm.dispatchToUsers("gameField", data);
            currItm.dispatchToUsers("tanksChart", currItm._getTanksChart());
        }, constants.GAME_DELAY);
        setTimeout(currItm._stopGame, constants.GAME_TIMER);
    };

    this._getFullSeconds = function(time)
    {
        return constants.GAME_TIMER - ((new Date()) - time);
    };

    this._stopGame = function()
    {
        clearInterval(currItm.gameIntervalId);
        currItm.dispatchToUsers("tanksChart", currItm._getTanksChart());
        currItm.dispatchToUsers("endGame", null);
        currItm.started = false;
        currItm._resetUsers();
        eventObj.dispatch("gameChanged");
    };

    this._resetUsers = function()
    {
        for (var i = 0; i < this.tanks.length; ++i)
        {
            this.tanks[i].inGame = false;
        }
    };

    this.dispatchToUsers = function(event, data)
    {
        for (var i = 0; i < currItm.tanks.length; ++i)
        {
            if (currItm.tanks[i] != undefined && currItm.tanks[i].socket != undefined)
            {
                currItm.tanks[i].socket.emit(event, data);
            }
        }
    };

    this._getTanksChart = function()
    {
        var result = [];
        var j = 0;
        for (var i = 0; i < currItm.tanks.length; ++i)
        {
            if (currItm.tanks[i] != undefined && currItm.tanks[i].tank != undefined)
            {
                result[j] = {};
                result[j].name = currItm.tanks[i].name;
                result[j].killing = currItm.tanks[i].tank.killing;
                result[j].death = currItm.tanks[i].tank.death;
                j++;
            }
        }
        return result;
    };

    this.addPlayer = function(player)
    {
        currItm.connectedUserCount++;
        for (var i = 0; i < currItm.tanks.length && currItm.tanks[i] != undefined; ++i){}
        if (i < currItm.userCount)
        {
            currItm.tanks[i] = player;
            return i;
        }
        else
        {
            return null;
        }
    };

    this.deletePlayer = function(id)
    {
        currItm.connectedUserCount--;
        delete currItm.tanks[id];
    };

    this.getClientList = function()
    {
        var result = [];
        var  j = 0;
        for (var i = 0; i < currItm.tanks.length; ++i)
        {
            if (currItm.tanks[i] != undefined && currItm.tanks[i].name != undefined)
            {
                result[j] = {};
                result[j].name = currItm.tanks[i].name;
                result[j].inGame = currItm.tanks[i].inGame;
                j++;
            }
        }
        return result;
    };

    this.playersEventObj.listen("destroy", function(userId)
    {
        console.log("Client " + userId + " disconnect from game " + currItm.id);
        var client = currItm.tanks[userId];
        client.socket.disconnect();
        client.destroyTank(currItm.field);
        currItm.deletePlayer(userId);
        eventObj.dispatch("gameLived", currItm.id);
        currItm.dispatchToUsers("userList", currItm.getClientList());
        eventObj.dispatch("gameChanged");
    });

    this.fieldEventObj.listen("tankDestroyed", function(tank)
    {
        if (tank.userId != undefined)
        {
            currItm.tanks[tank.userId].initTank(currItm.field);
        }
    });

    return this;
}


module.exports = Game;