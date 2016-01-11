/**
 * Created by Vasiliy on 1/6/2016.
 */

function Ball(cordX, cordY, route, field)
{
    this.x = cordX;
    this.y = cordY;
    this.route = route;
    field.gameField[this.y][this.x] = field.gameField[this.y][this.x] == NOTHING_CHAR ? BALL_CHAR : field.gameField[this.y][this.x];
    this.move = function()
    {
        if (field.gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        var isDamaged = calcHealth(this.x, this.y, field);
        if (field.gameField[this.y][this.x] == NOTHING_CHAR || isDamaged)
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (field.gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            return 1;
        }
        field.gameField[this.y][this.x] = NOTHING_CHAR;
        var stepX = getXDirect(this.route);
        var stepY = getYDirect(this.route);
        this.x += stepX;
        this.y += stepY;
        if (field.gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            this.x -= stepX;
            this.y -= stepY;
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (field.gameField[this.y][this.x] == BALL_CHAR)
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
            return 1;
        }
        if (field.gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        field.gameField[this.y][this.x] = BALL_CHAR;
        return 0;
    };
    this.draw = function()
    {
            drawRotatedObj(translateCharInRightDeg(this.route), g_ballImg, (this.x + 0.5) * SQUARE_SIZE, (this.y + 0.5) * SQUARE_SIZE, SQUARE_SIZE / 3, SQUARE_SIZE / 3, 0);
    };
}