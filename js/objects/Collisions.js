/**
 * Created by Vasiliy on 2/15/2016.
 */
function Collisions(field)
{
    this.getIntersection = function(obj, x, y, w, h)
    {
        return (((obj.x + obj.width / 2 > x - w / 2) && (x + w / 2 > obj.x - obj.width / 2) &&
        (obj.y + obj.height / 2 > y - h / 2) && (y + h / 2 > obj.y - obj.height / 2)));
    };

    this.getIntersectionBarricades = function(tank, stepX, stepY)
    {
        for (var i = 0; i < field.barricades.length; ++i)
        {
            if (this.getIntersection(tank, field.barricades[i].x, field.barricades[i].y, SQUARE_SIZE, SQUARE_SIZE))
            {
                if (tank.commonFunctionObj.isAngelRight(tank.angle))
                {
                    tank.x -= stepX * tank.speed;
                    tank.y -= stepY * tank.speed;
                    tank.motionBefore = NOTHING_CHAR;
                    tank.motion = NOTHING_CHAR;
                }
                else if (tank.isCrosed)
                {
                    tank.isCrosed = 0;
                    tank._returnStartAngle();

                }
            }
        }
    };

    this.getIntersectionBonus = function(tank, stepX, stepY)
    {
        for (var i = 0; i < field.bonus.length; ++i)
        {
            if (this.getIntersection(tank, field.bonus[i].x + SQUARE_SIZE / 2, field.bonus[i].y + SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE))
            {
                tank.x -= stepX * tank.speed;
                tank.y -= stepY * tank.speed;
                tank.motionBefore = NOTHING_CHAR;
                var bonus = field.bonus[i];
                bonus.type.upgrade(tank);
                bonus.used = 1;
            }
        }
    };

    this.getIntersectionPlayers = function(tank, stepX, stepY)
    {
        for (var i = 0; i < field.players.length; ++i)
        {
            if (field.players[i].x != tank.x || field.players[i].y != tank.y)
            {
                if(this.getIntersection(tank, field.players[i].x, field.players[i].y, field.players[i].width, field.players[i].height))
                {
                    if (tank.commonFunctionObj.isAngelRight(tank.angle))
                    {
                        tank.x -= stepX * tank.speed;
                        tank.y -= stepY * tank.speed;
                        tank.motionBefore = NOTHING_CHAR;
                        tank.motion = NOTHING_CHAR;
                    }
                    else if (tank.isCrosed)
                    {
                        tank.isCrosed = 0;
                        tank._returnStartAngle();
                    }
                }
            }
        }
    };

    this.getRotateIntersectionPlayers = function(tank)
    {
        for (var i = 0; i < field.players.length; ++i)
        {
            if ((field.players[i].x != tank.x || field.players[i].y != tank.y) &&
                this.getIntersection(tank, field.players[i].x, field.players[i].y, field.players[i].width, field.players[i].height))
            {
                return 1;
            }
        }
        return 0;
    };

    this.getRotateIntersectionBarricades = function(tank)
    {
        for (var i = 0; i < field.barricades.length; ++i)
        {
            if (this.getIntersection(tank, field.barricades[i].x, field.barricades[i].y, SQUARE_SIZE, SQUARE_SIZE))
            {
                return 1;
            }
        }
        return 0;
    };
}