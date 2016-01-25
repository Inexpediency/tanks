/**
 * Created by Vasiliy on 1/24/2016.
 */
function Bonus(x, y, type, field)
{
    var canvas = document.getElementById("gameField");
    var ctx = canvas.getContext("2d");

    this.x = x;
    this.y = y;
    this.time = BONUS_TIME;
    this.stageX = 0;
    this.stageY = 0;
    this.type = type;
    this.used = 0;

    this.move = function()
    {
        this.time--;
        if (this.time == 0 || field.gameField[this.y][this.x] != BONUS_CHAR)
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
            this.x * SQUARE_SIZE, this.y * SQUARE_SIZE,
            SQUARE_SIZE, SQUARE_SIZE);
    };
};

function Health()
{
    this.img = new Image();
    this.img.src =  HEALTH_BONUS_ADDRESS;
    this.maxStageX = 3;
    this.maxStageY = 3;
    this.dropeChance = 100;
    this.width = 32;
    this.height = 32;

    this.upgrade = function(tank)
    {
        tank.health++;
    };
}