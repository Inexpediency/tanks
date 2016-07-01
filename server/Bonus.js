/**
 * Created by Vasiliy on 2/9/2016.
 */
function Bonus(x, y, width, height, type)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.stageX = 0;
    this.stageY = 0;
    this.type = type;
    this.used = 0;

    this.move = function()
    {
        if (this.used)
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
}

module.exports = Bonus;