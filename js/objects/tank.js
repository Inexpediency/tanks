/**
 * Created by Vasiliy on 9/30/2015.
 */
function Tank(cordX, cordY, personalChar, consts, field)
{
    var commonFunctionObj = new CommonFunctionObj();

    this.health = consts.health;
    this.speed = consts.speedPatrol;

    this.rotateSpeed = commonFunctionObj.translateDividers(this.speed, 90);
    this.bodyAngle = commonFunctionObj.translateCharInRightDeg(UP_CHAR);
    this.towerAngle = commonFunctionObj.translateCharInRightDeg(UP_CHAR);
    this.rotateStep = consts.rotateTowerSpeed;
    this.finalBodeState = UP_CHAR;

    this.isTankReturn = 1;
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

    this.x = cordX;
    this.y = cordY;
    this.drawingX = this.x * SQUARE_SIZE;
    this.drawingY = this.y * SQUARE_SIZE;

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
        var residueX = this.drawingX - this.x * SQUARE_SIZE;
        var residueY = this.drawingY - this.y * SQUARE_SIZE;
        if(residueX  == 0 && residueY  == 0)
        {
            this.bodyAngle = this._calcBodyAngle();
        }
        if (residueX != 0 || residueY != 0 || !this._isAngelRight(this.bodyAngle))
        {
            this._createDustParticles();
        }
        if (this.health <= 1)
        {
            this._createSmokeParticles();
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && this._isTowerPosRight() &&
            residueX  == 0 && residueY  == 0)
        {
            this._calcFireDirection(this, field);
            this.lastFireTime = 0;
            this.fire = false;
        }
        commonFunctionObj.moveArrObj(this.dusts);
        commonFunctionObj.moveArrObj(this.smoke);
        this._moveTank();
        return 0;
    };

    this.draw = function()
    {
        commonFunctionObj.drawArrObj(this.dusts);
        commonFunctionObj.drawRotatedObj(this.bodyAngle, this.body, this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
        commonFunctionObj.drawRotatedObj(this.towerAngle, this.tower, this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE, this.towerWidth, this.towerHeight, 1);
        commonFunctionObj.drawArrObj(this.smoke);
    };

    this._createSmokeParticles = function()
    {
        var calcX;
        var calcY;
        for (var i = 0; i < SMOKE_COUNT; ++i)
        {
            calcX = this.drawingX;
            calcY = this.drawingY;
            calcX += SQUARE_SIZE * 0.5;
            calcY += SQUARE_SIZE * 0.5;
            calcX += commonFunctionObj.randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.cos(commonFunctionObj.inRad(this.bodyAngle));
            calcY += commonFunctionObj.randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.sin(commonFunctionObj.inRad(this.bodyAngle));
            if ((this._getCurrentChar(this.bodyAngle) == UP_CHAR || (this._getCurrentChar(this.bodyAngle) == DOWN_CHAR)))
            {
                calcX += commonFunctionObj.randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
            }
            if ((this._getCurrentChar(this.bodyAngle) == RIGHT_CHAR || (this._getCurrentChar(this.bodyAngle) == LEFT_CHAR)))
            {
                calcY += commonFunctionObj.randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
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
        var finalAngle = commonFunctionObj.translateCharInRightDeg(this.finalBodeState);
        for (var i = 0; i < DUST_COUNT; ++i)
        {
            calcX = this.drawingX;
            calcY = this.drawingY;
            if (!this._isAngelRight(this.bodyAngle))
            {
                calcAngle = this.bodyAngle;
                calcX += SQUARE_SIZE * 0.5;
                calcY += SQUARE_SIZE * 0.5;
                if (calcAngle < finalAngle || (finalAngle == 0 && calcAngle >= 180))
                {
                    calcAngle += (commonFunctionObj.randSign() >= 0) * 180;
                    calcAngle = commonFunctionObj.inRad(calcAngle);
                    calcY += SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                    calcX -= SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
                }
                else
                {
                    calcAngle += (commonFunctionObj.randSign() >= 0) * 180;
                    calcAngle = commonFunctionObj.inRad(calcAngle);
                    calcY -= SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                    calcX += SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
                }
                var radius = commonFunctionObj.randNumb(0, SQUARE_SIZE / 2.25);
                calcX += Math.cos(calcAngle) * radius;
                calcY += Math.sin(calcAngle) * radius;
            }
            else if (this.motionBefore == DOWN_CHAR)
            {
                calcX += SQUARE_SIZE / 4 + commonFunctionObj.randNumb(0, SQUARE_SIZE / 2);
                calcY += SQUARE_SIZE + commonFunctionObj.randNumb(-SQUARE_SIZE, 0);
            }
            else if (this.motionBefore == UP_CHAR)
            {
                calcX += SQUARE_SIZE / 4 + commonFunctionObj.randNumb(0, SQUARE_SIZE / 2);
                calcY += commonFunctionObj.randNumb(0, SQUARE_SIZE);
            }
            else if (this.motionBefore == RIGHT_CHAR)
            {
                calcY += SQUARE_SIZE / 4 + commonFunctionObj.randNumb(0, SQUARE_SIZE / 2);
                calcX += SQUARE_SIZE + commonFunctionObj.randNumb(-SQUARE_SIZE, 0);
            }
            else if (this.motionBefore == LEFT_CHAR)
            {
                calcY += SQUARE_SIZE / 4 + commonFunctionObj.randNumb(0, SQUARE_SIZE / 2);
                calcX += commonFunctionObj.randNumb(0, SQUARE_SIZE);
            }
            this.dusts[this.dusts.length] = new DynamicParticle(this.dustImg, calcX, calcY,
                0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, SQUARE_SIZE / 40, SQUARE_SIZE / 40);
        }
    };

    this._calcFireDirection = function()
    {
        if (this.towerState == UP_CHAR)
        {
            field.balls[field.balls.length] = new Ball(this.x, this.y - 1, this.towerState, field);
        }
        else if (this.towerState == DOWN_CHAR)
        {
            field.balls[field.balls.length] = new Ball(this.x, this.y + 1, this.towerState, field);
        }
        else if (this.towerState == RIGHT_CHAR)
        {
            field.balls[field.balls.length] = new Ball(this.x + 1, this.y, this.towerState, field);
        }
        else if (this.towerState == LEFT_CHAR)
        {
            field.balls[field.balls.length] = new Ball(this.x - 1, this.y, this.towerState, field);
        }
    };

    this._moveTank = function()
    {
        field.gameField[this.y][this.x] = NOTHING_CHAR;
        if (this._isCharSame(this._getCurrentChar(this.bodyAngle), this.motion) && this.motionBefore == NOTHING_CHAR)
        {
            this.motionBefore = this.motion;
        }
        var stepX = commonFunctionObj.getXDirect(this.motionBefore);
        var stepY = commonFunctionObj.getYDirect(this.motionBefore);
        this.drawingX += stepX * this.speed;
        this.drawingY += stepY * this.speed;
        this.x += stepX;
        this.y += stepY;
        var residueX = this.drawingX % SQUARE_SIZE;
        var residueY = this.drawingY % SQUARE_SIZE;
        if ((residueY < SQUARE_SIZE / 2 && stepY < 0) || (residueY > SQUARE_SIZE / 2 && stepY > 0))
        {
            this.y -= stepY;
        }
        if ((residueX < SQUARE_SIZE / 2 && stepX < 0) || (residueX > SQUARE_SIZE / 2 && stepX > 0))
        {
            this.x -= stepX;
        }
        if (field.gameField[this.y][this.x] != NOTHING_CHAR && this.isTankReturn)
        {
            if (field.gameField[this.y][this.x] == BONUS_CHAR)
            {
                var bonus = field.bonus[commonFunctionObj.findElement(this.x, this.y, field.bonus)];
                field.gameField[this.y][this.x] = NOTHING_CHAR;
                bonus.type.upgrade(this);
            }
            else
            {
                this.motionBefore = this._reverseChar(this.motionBefore);
                this.motion = NOTHING_CHAR;
                this.isTankReturn = 0;
            }
        }
        if (this.drawingX % SQUARE_SIZE == 0 && this.drawingY % SQUARE_SIZE == 0)
        {
            this.motionBefore = NOTHING_CHAR;
            this.isTankReturn = 1;
        }
        if ((residueY > SQUARE_SIZE / 2 && stepY < 0) || (residueY < SQUARE_SIZE / 2 && stepY > 0))
        {
            this.y -= stepY;
        }
        if ((residueX > SQUARE_SIZE / 2 && stepX < 0) || (residueX < SQUARE_SIZE / 2 && stepX > 0))
        {
            this.x -= stepX;
        }
        field.gameField[this.y][this.x] = this.character;
    };

    this._calcMoving = function()
    {
        this._patrol();
        var player = field.player;
        if (this._isPlayerFound(player.x, player.y, this.x, this.y))
        {
            this._fire();
        }
    };

    this._patrol = function()
    {
        if (this.motion == NOTHING_CHAR && this._isAngelRight(this.bodyAngle))
        {
            var direction = commonFunctionObj.randNumb(0, 4);
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

    this._fire = function()
    {
        if (this.x == field.player.x)
        {
            this.fire = 1;
            if (this.y > field.player.y)
            {
                this.towerState = DOWN_CHAR;
            }
            else
            {
                this.towerState = UP_CHAR;
            }
        }
        else
        {
            this.fire = 1;
            if (this.x > field.player.x)
            {
                this.towerState = LEFT_CHAR;
            }
            else
            {
                this.towerState = RIGHT_CHAR;
            }
        }
    };

    this._isPlayerFound = function(plaX, plaY, enX, enY)
    {
        var y;
        var sign;
        if (plaX == enX)
        {
            sign = plaY > enY ? 1 : -1;
            for (y = enY; (y > plaY && sign < 0) || (y < plaY && sign > 0); y = y + sign)
            {
                if (field.gameField[y][enX] == BARRICADE_CHAR ||
                    field.gameField[y][enX] == TRAVELED_BARRICADE_CHAR)
                {
                    return 0;
                }
            }
            return 1;
        }
        else
        {
            var squareHalf = Math.floor(SQUARE_SIZE / 2);
            sign = plaX > enX ? Math.floor(SQUARE_SIZE / 10) : -Math.floor(SQUARE_SIZE / 10);
            var x1 = enX * SQUARE_SIZE + squareHalf;
            var y1 = enY * SQUARE_SIZE + squareHalf;
            var x2 = plaX * SQUARE_SIZE + squareHalf;
            var y2 = plaY * SQUARE_SIZE + squareHalf;
            for (var x = x1; (x > x2 && sign < 0) || (x < x2 && sign > 0); x += sign)
            {
                y = Math.floor((((x - x1) * (y2 - y1) / (x2 - x1)) + y1) / SQUARE_SIZE);
                if (field.gameField[y][Math.floor(x / SQUARE_SIZE)] == BARRICADE_CHAR ||
                    field.gameField[y][Math.floor(x / SQUARE_SIZE)] == TRAVELED_BARRICADE_CHAR)
                {
                    return 0;
                }
            }
            return 1;

        }
    };

    this._isTowerPosRight = function()
    {
        return this.towerAngle == 0 && this.towerState == RIGHT_CHAR||
               this.towerAngle == 90 && this.towerState == UP_CHAR||
               this.towerAngle == 180 && this.towerState == LEFT_CHAR||
               this.towerAngle == 270 && this.towerState == DOWN_CHAR
    };

    this._isAngelRight = function(angle)
    {
        return angle == 0 ||
            angle == 90 ||
            angle == 180||
            angle == 270 ||
            angle == 360
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
        var finalAngle = commonFunctionObj.translateCharInRightDeg(this.finalBodeState);
        var finalAngle = finalAngle == 0 && this.bodyAngle > 180 ? 360 : finalAngle;
        var stAngle = this.bodyAngle == 360 && finalAngle <= 180 ? 0 : this.bodyAngle;
        stAngle = stAngle == 0 && finalAngle > 180 ? 360 : stAngle;
        if (stAngle != finalAngle &&
            Math.abs(stAngle - finalAngle) != 180)
        {
            if (stAngle < finalAngle)
            {
                return stAngle + this.rotateSpeed;
            }
            else
            {
                return stAngle - this.rotateSpeed;
            }
        }
        return stAngle;
    };

    this._calcTowerAngel = function()
    {
        var finalAngle = commonFunctionObj.translateCharInRightDeg(this.towerState);
        var calcFinalAngle = finalAngle == 0 && this.towerAngle > 180 ? 360 : finalAngle;
        if (this.towerAngle != calcFinalAngle)
        {
            var stAngle = this.towerAngle == 360 && finalAngle <= 180 ? 0 : this.towerAngle;
            stAngle = this.towerAngle == 0 && finalAngle > 180 ? 360 : this.towerAngle;
            if (stAngle < calcFinalAngle)
            {
                return stAngle + this.rotateStep;
            }
            else
            {
                return stAngle - this.rotateStep;
            }
        }
        else
        {
            return this.towerAngle == 360 ? 0 : this.towerAngle;
        }
    };
};