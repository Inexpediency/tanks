/**
 * Created by Vasiliy on 1/6/2016.
 */
function Bang(x, y, field)
{
    var constants = require("../common/constants.js").constants;
    var LAST_STATE_X = 7;
    var LAST_STATE_Y = 5;
    this.x = x;
    this.y = y;
    this.stateX = 0;
    this.stateY = 0;
    this.width = constants.ELEMENT_SIZE;
    this.height = constants.ELEMENT_SIZE;

    this.move = function()
    {
        this.stateX++;
        if (this.stateX > LAST_STATE_X)
        {
            this.stateX = 0;
            this.stateY++;
            if (LAST_STATE_Y / 3 < this.stateY)
            {
                field.eventController.dispatch("bangOver", this);
            }
            return this.stateY > LAST_STATE_Y;
        }
        return 0;
    };
}

module.exports = Bang;