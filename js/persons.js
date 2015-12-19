/**
 * Created by Vasiliy on 9/30/2015.
 */
function Player(cordX, cordY, personalChar, consts)
{
    this.initDefault = function()
    {
        this.health = consts.health;
        this.speed = consts.speedPatrol;
        this.normalSpeed = consts.speedNormal;
        this.patrolSpeed = consts.speedPatrol;
        this.rotateSpeed = translateDividers(this.speed, 90);
        this.bodyAngle = translateCharInRightDeg(UP_CHAR);
        this.towerAngle = translateCharInRightDeg(UP_CHAR);
        this.rotateStep = consts.rotateTowerSpeed;
        this.fire = false;
        this.lastFireTime = 0;
        this.foundRadius = consts.foundRadius;
        this.character = personalChar;
        this.towerHeight = SQUARE_SIZE / 3.5;
        this.towerWidth = SQUARE_SIZE / 1.5;
        this.tower = new Image();
        this.tower.src = consts.towerImgAddres;
        this.body = new Image();
        this.body.src = consts.bodyImageAddres;
        this.x = cordX;
        this.y = cordY;
        this.isTankReturn = 1;
        this.drawingX = this.x * SQUARE_SIZE;
        this.drawingY = this.y * SQUARE_SIZE;
        this.finalBodeState = UP_CHAR;
        this.motion = NOTHING_CHAR;
        this.motionBefore = NOTHING_CHAR;
        this.towerState = UP_CHAR;
    };
    this.move = function()
    {
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
                                this.bodyAngle, this.motionBefore);
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && isTowerPosRight(this.towerAngle, this.towerState) &&
            residueX  == 0 && residueY  == 0)
        {
            calcFireDirection(this);
            this.lastFireTime = 0;
            this.fire = false;
        }
        if (this.health <= 1)
        {
            createSmokeParticles(this.drawingX, this.drawingY, this.bodyAngle);
        }
        moveTank(this);
    };
    this.draw = function()
    {
        g_ctx.translate(this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE);
        g_ctx.rotate(inRad(this.bodyAngle));
        g_ctx.drawImage(this.body, Math.floor(-SQUARE_SIZE / 2), Math.floor(-SQUARE_SIZE / 2), SQUARE_SIZE, SQUARE_SIZE);
        g_ctx.rotate(-inRad(this.bodyAngle));
        g_ctx.rotate(inRad(this.towerAngle));
        g_ctx.drawImage(this.tower, Math.floor(-this.towerHeight / 2), Math.floor(-this.towerHeight / 2), this.towerWidth, this.towerHeight);
        g_ctx.rotate(-inRad(this.towerAngle));
        g_ctx.translate(-this.drawingX - 0.5 * SQUARE_SIZE, -this.drawingY - 0.5 * SQUARE_SIZE);
    };
}

function Ball(cordX, cordY, route)
{
    this.x = cordX;
    this.y = cordY;
    this.route = route;
    g_gameField[this.y][this.x] = g_gameField[this.y][this.x] == NOTHING_CHAR ? BALL_CHAR : g_gameField[this.y][this.x];
    this.move = function()
    {
        if (g_gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            g_bangs[g_bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        var isDamaged = calcHealth(this.x, this.y);
        if (g_gameField[this.y][this.x] == NOTHING_CHAR || isDamaged)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            g_bangs[g_bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (g_gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            return 1;
        }
        g_gameField[this.y][this.x] = NOTHING_CHAR;
        var stepX = getXDirect(this.route);
        var stepY = getYDirect(this.route);
        this.x += stepX;
        this.y += stepY;
        if (g_gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            this.x -= stepX;
            this.y -= stepY;
            g_bangs[g_bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (g_gameField[this.y][this.x] == BALL_CHAR)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            return 1;
        }
        if (g_gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            g_bangs[g_bangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        g_gameField[this.y][this.x] = BALL_CHAR;
        return 0;
    };
    this.draw = function()
    {
        g_ctx.translate((this.x + 0.5) * SQUARE_SIZE, (this.y + 0.5) * SQUARE_SIZE);
        g_ctx.rotate(inRad(translateCharInRightDeg(this.route)));
        g_ctx.drawImage(g_ballImg, -SQUARE_SIZE / 8, -SQUARE_SIZE / 8, SQUARE_SIZE / 3, SQUARE_SIZE / 3);
        g_ctx.rotate(-inRad(translateCharInRightDeg(this.route)));
        g_ctx.translate(-(this.x + 0.5) * SQUARE_SIZE, -(this.y + 0.5) * SQUARE_SIZE);
    };
}

function Bang(x, y)
{
    this.x = x;
    this.y = y;
    this.liveTime = BANG_TIME;
    this.speedX = 0;
    this.speedY = 0;
    this.fireRadius = (SQUARE_SIZE - SQUARE_SIZE % 12) / 12;
    this.fireParticles = [];
    this.move = function()
    {
        for (var i = 0; i < this.liveTime; ++i)
        {
            var finalX = randNumb(-this.fireRadius, this.fireRadius);
            var finalY = randSign() * Math.sqrt(this.fireRadius * this.fireRadius - finalX * finalX);
            var startX = this.x * SQUARE_SIZE + (SQUARE_SIZE - SQUARE_SIZE % 2) / 2;
            var startY = this.y * SQUARE_SIZE + (SQUARE_SIZE - SQUARE_SIZE % 2) / 2;
            this.fireParticles[this.fireParticles.length] = new DynamicParticle(g_sparkImg, startX, startY,
                                                                                finalX / SPARK_SPEED, finalY / SPARK_SPEED,
                                                                                LAST_X_SPARK_STATE, LAST_Y_SPARK_STATE,
                                                                                SQUARE_SIZE / 3, SQUARE_SIZE / 3);
        }
        this.moveFireParticles();
        if (this.liveTime-- <= 0 && this.fireParticles.length == 0)
        {
            return 1;
        }
        return 0;
    };
    this.draw = function()
    {
        for (var i = this.fireParticles.length - 1; i >= 0; --i)
        {
            if (this.fireParticles[i].draw())
            {
                this.fireParticles.splice(i, 1);
            }
        }
    };
    this.moveFireParticles = function()
    {
        for (var i = this.fireParticles.length - 1; i >= 0; --i)
        {
            this.fireParticles[i].move();
        }
    };
}

function DynamicParticle(img, x, y, SpeedX, SpeedY, lastX, lastY, width, height)
{
    this.x = x;
    this.y = y;
    this.speedY = SpeedY;
    this.speedX = SpeedX;
    this.stateX = 0;
    this.stateY = 0;
    this.sparkWidth = img.width / (lastX + 1);
    this.sparkHeight = img.height / (lastY + 1);
    this.move = function()
    {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.draw = function()
    {
        g_ctx.drawImage(
            img,
            this.sparkWidth * this.stateX,
            this.sparkHeight * this.stateY, this.sparkWidth, this.sparkHeight,
            this.x - width / 2, this.y - height / 2,
            width, height);
        if (++this.stateX > lastX)
        {
            this.stateX = 0;
            if (++this.stateY > lastY)
            {
                return 1;
            }
        }
        return 0;
    };
}

function StaticParticle(x, y, img, lastX, lastY, width, height)
{
    this.x = x;
    this.y = y;
    this.stateX = 0;
    this.stateY = 0;
    this.SmokeWidth = img.width / (lastX + 1);
    this.SmokeHeight = img.height / (lastY + 1);
    this.draw = function()
    {
        g_ctx.drawImage(img,
                        this.SmokeWidth * this.stateX, this.SmokeHeight * this.stateY,
                        this.SmokeWidth, this.SmokeHeight,
                        this.x - width / 2, this.y - height / 2,
                        width, height);
        if (++this.stateX > LAST_X_SMOKE_STATE)
        {
            this.stateX = 0;
            if (++this.stateY > LAST_Y_SMOKE_STATE)
            {
                return 1;
            }
        }
        return 0;
    };
}