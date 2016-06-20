/**
 * Created by Vasiliy on 2/17/2016.
 */
function EventController()
{
    this.events = [];

    var currItm = this;
    
    this.listen = function(event, handler)
    {
        var evIndex = currItm.events.length;
        currItm.events[evIndex] = {};
        currItm.events[evIndex].event = event;
        currItm.events[evIndex].handler = handler;
    };

    this.dispatch = function(event, dispatcher)
    {
        for (var i = 0; i < currItm.events.length; ++i)
        {
            if (currItm.events[i].event == event)
            {
                currItm.events[i].handler(dispatcher);
            }
        }
    };

    return this;
}

if (typeof module !== "undefined" && module.exports)
{
    module.exports = EventController;
}