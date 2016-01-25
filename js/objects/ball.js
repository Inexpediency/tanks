/**
 * Created by Vasiliy on 1/6/2016.
 */

function Ball(cordX, cordY, route, field)
{
    var commonFunctionObj = new CommonFunctionObj();

    this.x = cordX;
    this.y = cordY;
    this.route = route;
    this.img = new Image();
    this.img.src = BALL_ADDRESS;
    field.gameField[this.y][this.x] = field.gameField[this.y][this.x] == NOTHING_CHAR ? BALL_CHAR : field.gameField[this.y][this.x];

    this.move = function()
    {
        if (field.gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        var isDamaged = this._calcHealth();
        if (field.gameField[this.y][this.x] == NOTHING_CHAR || isDamaged)
        {
            field.bangs[field.bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (field.gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            return 1;
        }
        field.gameField[this.y][this.x] = NOTHING_CHAR;
        var stepX = commonFunctionObj.getXDirect(this.route);
        var stepY = commonFunctionObj.getYDirect(this.route);
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
        commonFunctionObj.drawRotatedObj(commonFunctionObj.translateCharInRightDeg(this.route), this.img,
                                        (this.x + 0.5) * SQUARE_SIZE,
                                        (this.y + 0.5) * SQUARE_SIZE,
                                        SQUARE_SIZE / 3, SQUARE_SIZE / 3, 0);
    };

    this._calcHealth = function()
    {
        var tank = commonFunctionObj.findElement(this.x, this.y, field.players);
        if (field.players[tank] != null)
        {
            field.players[tank].health--;
            if (field.players[tank].health <= 0)
            {
                this._createBonus();
                field.players.splice(tank, 1);
            }
            return 1;
        }
        return 0;
    };

    this._createBonus = function()
    {
        var bonus = new Health(); // потом будет решаеться какой бонус выпадет
        if (field.bonus.length < MAX_BONUS_COUNT &&
            bonus.dropeChance > commonFunctionObj.randNumb(1, 100))
        {
            field.gameField[this.y][this.x] = BONUS_CHAR;
            field.bonus[field.bonus.length] = new Bonus(this.x, this.y, bonus, field);
        }
        else
        {
            field.gameField[this.y][this.x] = NOTHING_CHAR;
        }
    }
}