/**
 * Created by Vasiliy on 6/11/2016.
 */
function Game(data, eventObj)
{
    var constants = require("../common/constants.js").constants;
    var EventController = require("../common/EventController.js");

    this.playersEventObj = new EventController();
    this.players = [];
    this.name = data.name == "" ? "no_name" : data.name;
    var userCount = parseInt(data.userCount);
    this.userCount = (!isNaN(userCount) && userCount > 1 && userCount < constants.MAX_PLAYERS_COUNT) ? userCount : constants.MAX_PLAYERS_COUNT;
    this.connectedUserCount = 0;
    this.started = false;
    this.id = undefined;
    var currItm = this;

    this.playersEventObj.listen("destroy", function(userId)
    {
        console.log("Client disconnect from game " + currItm.id);
        currItm.deletePlayer(userId);
        currItm.dispatchUsers("userList", currItm.getClientList());
        eventObj.dispatch("gameLived", currItm.id);
        eventObj.dispatch("gameChanged");
    });

    this.dispatchUsers = function(event, data)
    {
        for (var i = 0; i < currItm.players.length && currItm.players[i] != undefined; ++i)
        {
            if (currItm.players[i] != undefined)
            {
                currItm.players[i].socket.emit(event, data);
            }
        }
    };

    this.addPlayer = function(player)
    {
        currItm.connectedUserCount++;
        for (var i = 0; i < currItm.players.length && currItm.players[i] != undefined; ++i){}
        if (i < currItm.userCount)
        {
            currItm.players[i] = player;
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
        delete currItm.players[id];
    };

    this.getClientList = function()
    {
        var result = [];
        for (var i = 0; i < currItm.players.length; ++i)
        {
            if (currItm.players[i] != undefined)
            {
                result[i] = {};
                result[i].name = currItm.players[i].name;
                result[i].ready = currItm.players[i].ready;
            }
        }
        return result;
    };

    return this;
}


module.exports = Game;