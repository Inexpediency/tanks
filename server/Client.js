/**
 * Created by Vasiliy on 6/11/2016.
 */
function Client(eventObj)
{
    var constants = new require("./server_constants.js").constants;
    this.id = undefined;
    this.name = undefined;
    this.socket = undefined;
    this.ready = false;
    this.eventObj = eventObj;
    var currItm = this;

    this.setSessionTimer = function()
    {
        currItm.sessionTimautId = setTimeout(function()
        {
            currItm.eventObj.dispatch("destroy", currItm.id);
        }, constants.CLIENT_LIVER_TIME);

    };

    return this;
}

module.exports = Client;