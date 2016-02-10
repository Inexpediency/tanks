/**
 * Created by Vasiliy on 1/6/2016.
 */

function Ball(x, y, route, field)
{
    var commonFunctionObj = new CommonFunctionObj();

    this.x = x;
    this.y = y;
    this.route = route;
    this.img = new Image();
    this.img.src = BALL_ADDRESS;

    this.move = function()
    {
        var stepX = commonFunctionObj.getXDirect(this.route);
        var stepY = commonFunctionObj.getYDirect(this.route);
        this.x += stepX * BALL_SPEED;
        this.y += stepY * BALL_SPEED;
        for(var i = 0; i < field.players.length; ++i)
        {
            if(this._getIntersection(field.players[i].drawingX, field.players[i].drawingY, field.players[i].width, field.players[i].height))
            {
                field.bangs[field.bangs.length] = new Bang(this.x, this.y);
                this._calcHealth(field.players[i]);
                return 1;
            }
        }

        for(var i = 0; i < field.barricades.length; ++i)
        {
            if(this._getIntersection(field.barricades[i].x, field.barricades[i].y, SQUARE_SIZE, SQUARE_SIZE))
            {
                if (field.barricades[i].character == TRAVELED_BARRICADE_CHAR)
                {
                    field.gameField[field.barricades[i].y / SQUARE_SIZE][field.barricades[i].x / SQUARE_SIZE] = NOTHING_CHAR;
                    field.barricades.splice(i, 1);
                }
                field.bangs[field.bangs.length] = new Bang(this.x, this.y);
                return 1;
            }
        }
        return 0;
    };

    this.draw = function()
    {
        commonFunctionObj.drawRotatedObj(commonFunctionObj.translateCharInRightDeg(this.route), this.img,
                                        this.x + 0.5 * SQUARE_SIZE,
                                        this.y + 0.5 * SQUARE_SIZE,
                                        SQUARE_SIZE / 3, SQUARE_SIZE / 3, 0);
    };

    this._calcHealth = function(tank)
    {
        if (tank != null)
        {
            tank.health--;
            if (tank.health <= 0)
            {
                this._createBonus(tank.drawingX, tank.drawingY);
                field.players.splice(commonFunctionObj.findElement(tank.x, tank.y, field.players), 1);
            }
            return 1;
        }
        return 0;
    };

    this._createBonus = function(x, y)
    {
        var randNumb = commonFunctionObj.randNumb(1, 4);
        var bonus;
        if (randNumb == 1)
        {
            bonus = new HealthBonus();
        }
        else
        {
            bonus = new HealthBonus();
        }
        if (field.bonus.length < MAX_BONUS_COUNT &&
            bonus.dropeChance > commonFunctionObj.randNumb(1, 100))
        {
            field.bonus[field.bonus.length] = new Bonus(x, y, bonus, field);
        }
    }
    
    this._getIntersection = function(x, y, w, h)
    {
        return (((this.x + 0.5 * SQUARE_SIZE > x) && (x + w > this.x + 0.5 * SQUARE_SIZE)) &&
                ((this.y + 0.5 * SQUARE_SIZE > y) && (y + h > this.y + 0.5 * SQUARE_SIZE)));
    };
}