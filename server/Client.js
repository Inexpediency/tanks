/**
 * Created by Vasiliy on 6/11/2016.
 */
function Client(eventObj)
{
    var constants = require("./server_constants.js").constants;
    var tanksConst = require("./tanks_const.js");
    var Tank = require("./Tank.js");
    this.id = undefined;
    this.name = "no_name";
    this.socket = undefined;
    this.inGame = false;
    this.eventObj = eventObj;
    var currItm = this;

    this.initHartBeet = function()
    {
        currItm.socket.on("hartBeat", function()
        {
            clearTimeout(currItm.sessionTimautId);
            currItm.setSessionTimer(constants.CLIENT_HART_BEAT_INTERVAL);
        });
    };

    this.setSessionTimer = function(delay)
    {
        currItm.sessionTimautId = setTimeout(function()
        {
            currItm.eventObj.dispatch("destroy", currItm.id);
        }, delay);

    };

    this.initTank = function(field)
    {
        if (this.tank == undefined)
        {
            this.tank = new Tank(this.id, field);
            field.tanks[field.tanks.length] = this.tank;
        }
        if (this.tank.health == undefined || this.tank.health == 0)
        {
            var cord = field.getRandomPlaceFor(this.tank);
            this.tank.init(cord.x, cord.y, tanksConst.TANK_CONST);
        }
    };

    this.destroyTank = function(field)
    {
        var tankNumb = field.getTankNumbById(this.id);
        field.tanks.splice(tankNumb, 1);
        this.tank = undefined;
    };

    return this;
}

module.exports = Client;