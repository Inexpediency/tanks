/**
 * Created by Vasiliy on 6/21/2016.
 */
function Tank(id, field)
{
    var constants = require("../common/constants.js").constants;
    var CommonFuncObj = require("./CommonFuncObj.js");
    var Collisions = require("./Collisions.js");
    var Ball = require("./Ball.js");
    this.commonFunctionObj = new CommonFuncObj();
    this.userId = id;
    this.killing = 0;
    this.death = 0;
    this.init = function(x, y, consts)
    {
        this.health = consts.health;
        this.speed = consts.speed;

        this.rotateSpeed = this.commonFunctionObj.translateDividers(this.speed, 90);
        this.isCrosed = 0;
        this.angle = this.commonFunctionObj._translateCharInRightDeg(constants.RIGHT_CHAR);
        this.towerAngle = this.commonFunctionObj._translateCharInRightDeg(constants.RIGHT_CHAR);
        this.rotateTowerSpeed = consts.rotateTowerSpeed;
        this.finalBodeState = constants.RIGHT_CHAR;

        this.fire = false;
        this.lastFireTime = 0;
        this.reloadingTime = consts.reloadingTime;

        this.width = this.startWidth;
        this.height = this.startHeight;

        this.startWidth = constants.ELEMENT_SIZE;
        this.startHeight = this.startWidth / 2;

        this.x = x * constants.ELEMENT_SIZE + constants.ELEMENT_SIZE / 2;
        this.y = y * constants.ELEMENT_SIZE + constants.ELEMENT_SIZE / 2;
        this.towerState = constants.UP_CHAR;
        this.motion = constants.NOTHING_CHAR;
    };

    this.motionBefore = constants.NOTHING_CHAR;

    this.move = function()
    {
        if (this.commonFunctionObj.isAngelRight(this.angle))
        {
            this.finalBodeState = this.motion == constants.NOTHING_CHAR ? this.finalBodeState : this.motion;
        }
        this.towerAngle = this._calcTowerAngel();
        this.lastFireTime++;
        this.angle = this._calcBodyAngle();
        this._resize();
        if (this.fire && this.lastFireTime > this.reloadingTime && this._isTowerPosRight())
        {
            field.balls[field.balls.length] = new Ball(this.x, this.y, this.towerState, field, this);
            this.lastFireTime = 0;
            this.fire = false;
        }
        this._moveTank();
        return 0;
    };

    this._moveTank = function()
    {
        if (this._isCharSame(this._getCurrentChar(this.angle), this.motion))
        {
            this.motionBefore = this.motion;
        }
        else
        {
            this.motionBefore = constants.NOTHING_CHAR;
        }
        var stepX = this.commonFunctionObj.getXDirect(this.motionBefore);
        var stepY = this.commonFunctionObj.getYDirect(this.motionBefore);
        this.x += stepX * this.speed;
        this.y += stepY * this.speed;
        var currBonus = field.collisions.getIntersectedObj(this, field.bonus);
        if (currBonus != null)
        {
            this.x -= stepX * this.speed;
            this.y -= stepY * this.speed;
            this.motionBefore = constants.NOTHING_CHAR;
            currBonus.type.upgrade(this);
            currBonus.used = 1;
        }
        if (field.collisions.isIntersectedObj(this, field.barricades) ||
            field.collisions.isIntersectedObj(this, field.tanks))
        {
            if (this.commonFunctionObj.isAngelRight(this.angle))
            {
                this.x -= stepX * this.speed;
                this.y -= stepY * this.speed;
                this.motionBefore = constants.NOTHING_CHAR;
                this.motion = constants.NOTHING_CHAR;
            }
            else if (this.isCrosed)
            {
                this.isCrosed = 0;
                this._returnStartAngle();
            }
        }
    };

    this._isTowerPosRight = function()
    {
        return this.towerAngle == 0   && this.towerState == constants.RIGHT_CHAR||
               this.towerAngle == 90  && this.towerState == constants.UP_CHAR||
               this.towerAngle == 180 && this.towerState == constants.LEFT_CHAR||
               this.towerAngle == 270 && this.towerState == constants.DOWN_CHAR
    };

    this._isCharSame = function(char1, char2)
    {
        return (char1 == char2) || (char1 == this._reverseChar(char2))
    };

    this._getCurrentChar = function(deg)
    {
        if (deg == 90)
        {
            return constants.UP_CHAR;
        }
        else if (deg == 180)
        {
            return constants.LEFT_CHAR;
        }
        else if (deg == 270)
        {
            return constants.DOWN_CHAR;
        }
        else if (deg == 360 || deg == 0)
        {
            return constants.RIGHT_CHAR;
        }
        return null;
    };

    this._reverseChar = function(char)
    {
        if (char == constants.UP_CHAR)
        {
            return constants.DOWN_CHAR;
        }
        else if (char == constants.DOWN_CHAR)
        {
            return constants.UP_CHAR;
        }
        else if (char == constants.RIGHT_CHAR)
        {
            return constants.LEFT_CHAR;
        }
        else if (char == constants.LEFT_CHAR)
        {
            return constants.RIGHT_CHAR;
        }
        return constants.NOTHING_CHAR;
    };

    this._calcBodyAngle = function()
    {
        var finalAngle = this.commonFunctionObj._translateCharInRightDeg(this.finalBodeState) % 360;
        var stAngle = this.angle % 360;
        if (this.commonFunctionObj.isAngelRight(stAngle) && stAngle != finalAngle)
        {
            if (stAngle > finalAngle)
            {
                this.angle -= 90;
            }
            else
            {
                this.angle += 90;
            }
            this._resize();
            this.isCrosed = field.collisions.isIntersectedObj(this, field.barricades) || field.collisions.isIntersectedObj(this, field.tanks);
        }
        if (stAngle != finalAngle &&
            Math.abs(stAngle - finalAngle) != 180)
        {
            if (stAngle < finalAngle)
            {
                stAngle += this.rotateSpeed;
            }
            else
            {
                stAngle -= this.rotateSpeed;
            }
        }
        return stAngle;
    };

    this._resize = function()
    {
        var angleW;
        var angleH;
        if (this.angle <= 180 && this.angle >= 90 || this.angle <= 360 && this.angle >= 270)
        {
            angleW = this.commonFunctionObj.inRad(this.angle) - Math.atan(this.startHeight / this.startWidth);
            angleH = this.commonFunctionObj.inRad(this.angle) + Math.atan(this.startHeight / this.startWidth);
        }
        else
        {
            angleW = this.commonFunctionObj.inRad(this.angle) + Math.atan(this.startHeight / this.startWidth);
            angleH = this.commonFunctionObj.inRad(this.angle) - Math.atan(this.startHeight / this.startWidth);
        }
        var w = Math.abs(Math.cos(angleW)) * Math.sqrt(this.startWidth * this.startWidth + this.startHeight * this.startHeight);
        var h = Math.abs(Math.sin(angleH)) * Math.sqrt(this.startWidth * this.startWidth + this.startHeight * this.startHeight);
        this.width = w;
        this.height = h;
    };

    this._calcTowerAngel = function()
    {
        var finalAngle = this.commonFunctionObj._translateCharInRightDeg(this.towerState);
        var calcFinalAngle = finalAngle == 0 && this.towerAngle > 180 ? 360 : finalAngle;
        if (this.towerAngle != calcFinalAngle)
        {
            var stAngle = this.towerAngle == 360 && finalAngle <= 180 ? 0 : this.towerAngle;
            stAngle = this.towerAngle == 0 && finalAngle > 180 ? 360 : this.towerAngle;
            if (stAngle < calcFinalAngle)
            {
                return stAngle + this.rotateTowerSpeed;
            }
            else
            {
                return stAngle - this.rotateTowerSpeed;
            }
        }
        else
        {
            return this.towerAngle == 360 ? 0 : this.towerAngle;
        }
    };

    this._returnStartAngle = function()
    {
        var finalAngle = this.commonFunctionObj._translateCharInRightDeg(this.finalBodeState);
        finalAngle = finalAngle == 0 && this.angle > 180 ? 360 : finalAngle;
        if (this.angle > finalAngle)
        {
            finalAngle += 90;
        }
        else
        {
            finalAngle -= 90;
        }
        finalAngle = finalAngle >= 360 ? finalAngle - 360 : finalAngle;
        this.finalBodeState = this.commonFunctionObj.translateRightDegInChar(finalAngle);
    };

    this.setMotion = function(motion)
    {
        if (this._isMotion(motion))
        {
            this.motion = motion;
        }
    };

    this.setTowerMotion = function(motion)
    {
        if (this._isMotion(motion))
        {
            this.towerState = motion;
        }
    };

    this._isMotion = function(motion)
    {
        return constants.UP_CHAR == motion ||
               constants.DOWN_CHAR == motion ||
               constants.LEFT_CHAR== motion ||
               constants.RIGHT_CHAR == motion;
    };

    this.calcHealth = function(ball)
    {
        if (this != null)
        {
            this.health--;
            if (this.health == 0)
            {
                this.death++;
                ball.master.killing++;
                field.eventController.dispatch('tankDestroyed', this);
            }
        }
    };

    return this;
}

module.exports = Tank;