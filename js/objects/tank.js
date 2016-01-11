/**
 * Created by Vasiliy on 9/30/2015.
 */
function Tank(cordX, cordY, personalChar, consts, field)
{
    this.initDefault = function()
    {
        this.health = consts.health;
        this.speed = consts.speedPatrol;

        this.rotateSpeed = translateDividers(this.speed, 90);
        this.bodyAngle = translateCharInRightDeg(UP_CHAR);
        this.towerAngle = translateCharInRightDeg(UP_CHAR);
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
    };
    this.move = function()
    {
        if (this.character != PLAYER_CHAR)
        {
            calcMoving(this, field);
        }
        this.towerAngle = calcTowerAngel(this.towerAngle, translateCharInRightDeg(this.towerState), this.rotateStep);
        this.lastFireTime++;
        var residueX = this.drawingX - this.x * SQUARE_SIZE;
        var residueY = this.drawingY - this.y * SQUARE_SIZE;
        if(residueX  == 0 && residueY  == 0)
        {
            this.bodyAngle = calcBodyAngle(this.bodyAngle, translateCharInRightDeg(this.finalBodeState), this.rotateSpeed);
        }
        if (residueX != 0 || residueY != 0 || !isAngelRight(this.bodyAngle))
        {
            createDustParticles(this.drawingX, this.drawingY,
                                translateCharInRightDeg(this.finalBodeState),
                                this.bodyAngle, this.motionBefore, this.dusts);
        }
        if (this.health <= 1)
        {
            createSmokeParticles(this.drawingX, this.drawingY, this.bodyAngle, this.smoke);
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && isTowerPosRight(this.towerAngle, this.towerState) &&
            residueX  == 0 && residueY  == 0)
        {
            calcFireDirection(this, field);
            this.lastFireTime = 0;
            this.fire = false;
        }
        moveArrObj(this.dusts);
        moveArrObj(this.smoke);
        moveTank(this, field);
        return 0;
    };
    this.draw = function()
    {
        drawArrObj(this.dusts);
        drawRotatedObj(this.bodyAngle, this.body, this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
        drawRotatedObj(this.towerAngle, this.tower, this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE, this.towerWidth, this.towerHeight, 1);
        drawArrObj(this.smoke);
    };
}




