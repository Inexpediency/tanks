/**
 * Created by Vasiliy on 2/17/2016.
 */
function EventController()
{
    this.events = [];

    this.listen = function(event,handler)
    {
        var evIndex = this.events.length;
        this.events[evIndex] = {};
        this.events[evIndex].event = event;
        this.events[evIndex].handler = handler;
    };

    this.dispatch = function(event, dispatcher)
    {
        for (var i = 0; i < this.events.length; ++i)
        {
            if (this.events[i].event == event)
            {
                this.events[i].handler(dispatcher);
            }
        }
    }
}