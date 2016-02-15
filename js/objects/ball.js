/**
 * Created by Vasiliy on 1/6/2016.
 */

function Ball(x, y, w, h, route, field)
{
    var commonFunctionObj = new CommonFunctionObj();
    var collisions = new Collisions(field);
    console.log(collisions);

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.route = route;
    this.img = new Image();
    this.img.src = BALL_ADDRESS;

    this.move = function()
    {
        var stepX = commonFunctionObj.getXDirect(this.route);
        var stepY = commonFunctionObj.getYDirect(this.route);
        this.x += stepX * BALL_SPEED;
        this.y += stepY * BALL_SPEED;
        for (var i = 0; i < field.players.length; ++i)
        {
            if(collisions.getIntersection(this, field.players[i].x, field.players[i].y, field.players[i].width, field.players[i].height))
            {
                field.bangs[field.bangs.length] = new Bang(this.x, this.y);
                this._calcHealth(field.players[i]);
                return 1;
            }
        }

        for (var i = 0; i < field.barricades.length; ++i)
        {
            if(collisions.getIntersection(this, field.barricades[i].x, field.barricades[i].y, SQUARE_SIZE, SQUARE_SIZE))
            {
                if (field.barricades[i].character == TRAVELED_BARRICADE_CHAR)
                {
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
                                        this.x, this.y, this.width, this.height, 0);
    };

    this._calcHealth = function(tank)
    {
        if (tank != null)
        {
            tank.health--;
            if (tank.health <= 0)
            {
                this._createBonus(tank.x - tank.width / 2, tank.y - tank.height / 2);
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
        else if (randNumb == 2)
        {
            bonus = new SpeedBonus();
        }
        else if (randNumb == 3)
        {
            bonus = new TowerSpeedBonus();
        }
        else
        {
            bonus = new FireSpeedBonus();
        }
        if (field.bonus.length < MAX_BONUS_COUNT &&
            bonus.dropeChance > commonFunctionObj.randNumb(1, 100))
        {
            field.bonus[field.bonus.length] = new Bonus(x, y, bonus, field);
        }
    };
}