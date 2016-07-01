/**
 * Created by Vasiliy on 1/6/2016.
 */
function Ball(x, y, route, field, master)
{
    var constants = require("../common/constants.js").constants;
    var CommonFuncObj = require("./CommonFuncObj.js");
    var Bang = require("./Bang.js");
    var commonFunctionObj = new CommonFuncObj();

    this.x = x;
    this.y = y;
    this.width = constants.ELEMENT_SIZE / 5;
    this.height = constants.ELEMENT_SIZE / 5;
    this.route = route;
    this.master = master;
    this.health = constants.BALL_HEALTH;
    this.move = function()
    {
        var stepX = commonFunctionObj.getXDirect(this.route);
        var stepY = commonFunctionObj.getYDirect(this.route);
        this.x += stepX * constants.BALL_SPEED;
        this.y += stepY * constants.BALL_SPEED;
        var damagedPlayer = field.collisions.getIntersectedObj(this, field.tanks);
        if (damagedPlayer != null && damagedPlayer.userId != this.master.userId)
        {
            field.bangs[field.bangs.length] = new Bang(this.x, this.y, field);
            field.eventController.dispatch("tankDamaged", this);
            return 1;
        }

        var barricade = field.collisions.getIntersectedObj(this, field.barricades);

        if (barricade != null)
        {
            field.bangs[field.bangs.length] = new Bang(this.x, this.y, field);
            return 1;
        }
        var damagedBalls = field.collisions.getIntersectedObj(this, field.balls);

        if (damagedBalls != null)
        {
            field.bangs[field.bangs.length] = new Bang((this.x + damagedBalls.x) / 2, (this.y + damagedBalls.y) / 2, field);
            field.balls.splice(commonFunctionObj.findElement(damagedBalls.x, damagedBalls.y, field.balls));
            return 1;
        }

        return 0;
    };
    return this;
}

module.exports = Ball;