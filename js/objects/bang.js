/**
 * Created by Vasiliy on 1/6/2016.
 */
function Bang(x, y, field)
{
    var canvas = document.getElementById("gameField");
    var ctx = canvas.getContext("2d");

    this.x = x;
    this.y = y;
    this.stateX = 0;
    this.stateY = 0;
    this.img = new Image();
    this.img.src = BANG_ADDRESS;
    var LAST_STATE_X = 7;
    var LAST_STATE_Y = 5;
    this.sparkWidth = 256;
    this.sparkHeight = 256;
    this.width = SQUARE_SIZE;
    this.height = SQUARE_SIZE;

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

    this.draw = function()
    {
        ctx.drawImage(
            this.img,
            this.sparkWidth * this.stateX,
            this.sparkHeight * this.stateY, this.sparkWidth, this.sparkHeight,
            this.x - this.width / 2, this.y - this.height / 2,
            this.width, this.height);
    };
}