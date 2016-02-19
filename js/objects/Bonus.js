/**
 * Created by Vasiliy on 2/9/2016.
 */
function Bonus(x, y, width, height, type)
{
    var canvas = document.getElementById("gameField");
    var ctx = canvas.getContext("2d");

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.time = BONUS_TIME;
    this.stageX = 0;
    this.stageY = 0;
    this.type = type;
    this.used = 0;

    this.move = function()
    {
        this.time--;
        if (this.time == 0 || this.used)
        {
            return 1;
        }
        this.stageX++;
        if (this.stageX == this.type.maxStageX)
        {
            this.stageX = 0;
            this.stageY++;
            if (this.stageY == this.type.maxStageY)
            {
                this.stageY = 0;
            }
        }
        return 0;
    };

    this.draw = function()
    {
        ctx.drawImage(
            this.type.img,
            this.type.width * this.stageX,
            this.type.height * this.stageY,
            this.type.width, this.type.height,
            this.x - this.width / 2, this.y - this.height / 2,
            this.width, this.height);
    };
};