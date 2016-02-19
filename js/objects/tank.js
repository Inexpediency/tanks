/**
 * Created by Vasiliy on 9/30/2015.
 */
function Tank(x, y, personalChar, consts, field)
{
    this.commonFunctionObj = new CommonFunctionObj();
    this.collisions = new Collisions();

    this.health = consts.health;
    this.speed = consts.speedPatrol;

    this.rotateSpeed = this.commonFunctionObj.translateDividers(this.speed, 90);
    this.angle = this.commonFunctionObj.translateCharInRightDeg(RIGHT_CHAR);
    this.isCrosed = 0;
    this.towerAngle = this.commonFunctionObj.translateCharInRightDeg(RIGHT_CHAR);
    this.rotateTowerSpeed = consts.rotateTowerSpeed;
    this.finalBodeState = RIGHT_CHAR;

    this.fire = false;
    this.lastFireTime = 0;
    this.foundRadius = consts.foundRadius;
    this.towerHeight = SQUARE_SIZE / 3.5;
    this.towerWidth = SQUARE_SIZE / 1.5;

    this.tower = new Image();
    this.tower.src = consts.towerImgAddres;
    this.body = new Image();
    this.body.src = consts.bodyImageAddres;

    this.smokeImg = new Image();
    this.smokeImg.src = SMOKE_ADDRESS;
    this.dustImg = new Image();
    this.dustImg.src = DUST_ADDRESS;

    var currItm = this;

    $(currItm.body).load(function()
    {
        currItm.startWidth = SQUARE_SIZE;
        currItm.startHeight = currItm.startWidth / currItm.body.width  * currItm.body.height;
        currItm.width = currItm.startWidth;
        currItm.height = currItm.startHeight;
        currItm.x = x * SQUARE_SIZE + currItm.width / 2;
        currItm.y = y * SQUARE_SIZE + currItm.height / 2;
    });
    field.eventController.listen("tankDamaged", function(ball)
    {
        if (currItm.collisions.getIntersection(currItm, ball))
        {
            console.log(currItm);
            currItm._calcHealth();
        }
    });

    this.motion = NOTHING_CHAR;
    this.motionBefore = NOTHING_CHAR;
    this.towerState = UP_CHAR;

    this.smoke = [];
    this.dusts = [];

    this.character = personalChar;

    this.move = function()
    {
        if (this.character != PLAYER_CHAR)
        {
            this._calcMoving(this, field);
        }
        this.towerAngle = this._calcTowerAngel();
        this.lastFireTime++;
        this.angle = this._calcBodyAngle();
        this._resize();
        if (this.motion != NOTHING_CHAR || !this.commonFunctionObj.isAngelRight(this.angle))
        {
            this._createDustParticles();
        }
        if (this.health <= 1)
        {
            this._createSmokeParticles();
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && this._isTowerPosRight())
        {
            field.balls[field.balls.length] = new Ball(this.x, this.y, SQUARE_SIZE / 3, SQUARE_SIZE / 3, this.towerState, field);
            this.lastFireTime = 0;
            this.fire = false;
        }
        this.commonFunctionObj.moveArrObj(this.dusts);
        this.commonFunctionObj.moveArrObj(this.smoke);
        this._moveTank();
        return 0;
    };

    this.draw = function()
    {
        this.commonFunctionObj.ctx.fillStyle = "#ff5553";
        this.commonFunctionObj.ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.commonFunctionObj.drawArrObj(this.dusts);
        this.commonFunctionObj.drawRotatedObj(this.angle, this.body, this.x, this.y, this.startWidth, this.startHeight, 0);
        this.commonFunctionObj.drawRotatedObj(this.towerAngle, this.tower, this.x, this.y, this.towerWidth, this.towerHeight, 1);
        this.commonFunctionObj.drawArrObj(this.smoke);
    };

    this._createSmokeParticles = function()
    {
        var calcX;
        var calcY;
        for (var i = 0; i < SMOKE_COUNT; ++i)
        {
            calcX = this.x;
            calcY = this.y;
            calcX += this.commonFunctionObj.randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.cos(this.commonFunctionObj.inRad(this.angle));
            calcY += this.commonFunctionObj.randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.sin(this.commonFunctionObj.inRad(this.angle));
            if ((this._getCurrentChar(this.angle) == UP_CHAR || (this._getCurrentChar(this.angle) == DOWN_CHAR)))
            {
                calcX += this.commonFunctionObj.randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
            }
            if ((this._getCurrentChar(this.angle) == RIGHT_CHAR || (this._getCurrentChar(this.angle) == LEFT_CHAR)))
            {
                calcY += this.commonFunctionObj.randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
            }
            this.smoke[this.smoke.length] = new DynamicParticle(this.smokeImg, calcX, calcY,
                0, 0,
                LAST_X_SMOKE_STATE, LAST_Y_SMOKE_STATE,
                SQUARE_SIZE / 2, SQUARE_SIZE / 2);
        }
    };

    this._createDustParticles = function()
    {
        var calcX;
        var calcY;
        var calcAngle;
        var finalAngle = this.commonFunctionObj.translateCharInRightDeg(this.finalBodeState);
        for (var i = 0; i < DUST_COUNT; ++i)
        {
            calcX = this.x;
            calcY = this.y;
            if (!this.commonFunctionObj.isAngelRight(this.angle))
            {
                calcAngle = this.angle;
                if (calcAngle < finalAngle || (finalAngle == 0 && calcAngle >= 180))
                {
                    calcAngle += (this.commonFunctionObj.randSign() >= 0) * 180;
                    calcAngle = this.commonFunctionObj.inRad(calcAngle);
                    calcY += SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                    calcX -= SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
                }
                else
                {
                    calcAngle += (this.commonFunctionObj.randSign() >= 0) * 180;
                    calcAngle = this.commonFunctionObj.inRad(calcAngle);
                    calcY -= SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                    calcX += SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
                }
                var radius = this.commonFunctionObj.randNumb(0, SQUARE_SIZE / 2.25);
                calcX += Math.cos(calcAngle) * radius;
                calcY += Math.sin(calcAngle) * radius;
            }
            else
            {
                calcX += this.commonFunctionObj.randNumb(-this.width / 2, this.width / 2);
                calcY += this.commonFunctionObj.randNumb(-this.height / 2 , this.height / 2);
            }
            this.dusts[this.dusts.length] = new DynamicParticle(this.dustImg, calcX, calcY,
                0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, SQUARE_SIZE / 40, SQUARE_SIZE / 40);
        }
    };

    this._moveTank = function()
    {
        if (this._isCharSame(this._getCurrentChar(this.angle), this.motion))
        {
            this.motionBefore = this.motion;
        }
        else
        {
            this.motionBefore = NOTHING_CHAR;
        }
        var stepX = this.commonFunctionObj.getXDirect(this.motionBefore);
        var stepY = this.commonFunctionObj.getYDirect(this.motionBefore);
        this.x += stepX * this.speed;
        this.y += stepY * this.speed;
        var currBonus = this.collisions.getIntersectedObj(this, field.bonus);
        if (currBonus != null)
        {
            this.x -= stepX * this.speed;
            this.y -= stepY * this.speed;
            this.motionBefore = NOTHING_CHAR;
            currBonus.type.upgrade(this);
            currBonus.used = 1;
        }
        if (this.collisions.isIntersectedObj(this, field.barricades) ||
            this.collisions.isIntersectedObj(this, field.players))
        {
            if (this.commonFunctionObj.isAngelRight(this.angle))
            {
                this.x -= stepX * this.speed;
                this.y -= stepY * this.speed;
                this.motionBefore = NOTHING_CHAR;
                this.motion = NOTHING_CHAR;
            }
            else if (this.isCrosed)
            {
                this.isCrosed = 0;
                this._returnStartAngle();

            }
        }
    };

    this._calcMoving = function()
    {
        this._patrol();
    };

    this._patrol = function()
    {
        if (this.motion == NOTHING_CHAR && this.commonFunctionObj.isAngelRight(this.angle))
        {
            var direction = this.commonFunctionObj.randNumb(0, 4);
            if (direction == 0)
            {
                this.motion = RIGHT_CHAR;
                this.finalBodeState = RIGHT_CHAR;
                this.towerState = RIGHT_CHAR;
            }
            else if (direction == 1)
            {
                this.motion = LEFT_CHAR;
                this.finalBodeState = LEFT_CHAR;
                this.towerState = LEFT_CHAR;
            }
            else if (direction == 2)
            {
                this.motion = DOWN_CHAR;
                this.finalBodeState = DOWN_CHAR;
                this.towerState = DOWN_CHAR;
            }
            else if (direction == 3)
            {
                this.motion = UP_CHAR;
                this.finalBodeState = UP_CHAR;
                this.towerState = UP_CHAR;
            }
        }
    };

    this._isTowerPosRight = function()
    {
        return this.towerAngle == 0 && this.towerState == RIGHT_CHAR||
               this.towerAngle == 90 && this.towerState == UP_CHAR||
               this.towerAngle == 180 && this.towerState == LEFT_CHAR||
               this.towerAngle == 270 && this.towerState == DOWN_CHAR
    };

    this._isCharSame = function(char1, char2)
    {
        return (char1 == char2) || (char1 == this._reverseChar(char2))
    };

    this._getCurrentChar = function(deg)
    {
        if (deg == 90)
        {
            return UP_CHAR;
        }
        else if (deg == 180)
        {
            return LEFT_CHAR;
        }
        else if (deg == 270)
        {
            return DOWN_CHAR;
        }
        else if (deg == 360 || deg == 0)
        {
            return RIGHT_CHAR;
        }
        return null;
    };

    this._reverseChar = function(char)
    {
        if (char == UP_CHAR)
        {
            return DOWN_CHAR;
        }
        else if (char == DOWN_CHAR)
        {
            return UP_CHAR;
        }
        else if (char == RIGHT_CHAR)
        {
            return LEFT_CHAR;
        }
        else if (char == LEFT_CHAR)
        {
            return RIGHT_CHAR;
        }
        return NOTHING_CHAR;
    };

    this._calcBodyAngle = function()
    {
        var finalAngle = this.commonFunctionObj.translateCharInRightDeg(this.finalBodeState);
        finalAngle = finalAngle == 0 && this.angle > 180 ? 360 : finalAngle;
        var stAngle = this.angle == 360 && finalAngle <= 180 ? 0 : this.angle;
        stAngle = stAngle == 0 && finalAngle > 180 ? 360 : stAngle;
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
            this.isCrosed = this.collisions.isIntersectedObj(this, field.barricades) || this.collisions.isIntersectedObj(this, field.players);
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
        var finalAngle = this.commonFunctionObj.translateCharInRightDeg(this.towerState);
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
        var finalAngle = this.commonFunctionObj.translateCharInRightDeg(this.finalBodeState);
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

    this._calcHealth = function()
    {
        if (this != null)
        {
            this.health--;
            if (this.health <= 0)
            {
                field.eventController.dispatch('tankDestroyed', this);
            }
        }
    };
}