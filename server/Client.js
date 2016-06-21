/**
 * Created by Vasiliy on 6/11/2016.
 */
function Client(eventObj)
{
    var constants = require("./server_constants.js").constants;
    this.id = undefined;
    this.name = "no_name";
    this.socket = undefined;
    this.inGame = false;
    this.eventObj = eventObj;
    var currItm = this;

    this.setSessionTimer = function()
    {
        currItm.sessionTimautId = setTimeout(function()
        {
            currItm.eventObj.dispatch("destroy", currItm.id);
        }, constants.CLIENT_LIVE_TIME);

    };

    this.initTank = function()
    {

    };

    return this;
}

module.exports = Client;