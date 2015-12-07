/**
 * Created by Vasiliy on 9/30/2015.
 */
function Player(cordX, cordY, towerState, persChar, consts)
{
    this.initDefault = function()
    {
        this.health = consts.health;
        this.speed = consts.speedPatrol;
        this.normalSpeed = consts.speedNormal;
        this.patrolSpeed = consts.speedPatrol;
        this.rotateSpeed = translateDividers(this.speed, 90);
        this.bodyAngle = charInDeg(towerState);
        this.angle = charInDeg(towerState);
        this.rotateStep = consts.rotateTowerSpeed;
        this.fire = false;
        this.lastFireTime = 0;
        this.foundRadius = consts.foundRadius;
        this.character = persChar;
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
        this.routeBefor = towerState;
        this.motion = NOTHING_CHAR;
        this.motionBefore = NOTHING_CHAR;
        this.towerState = towerState;
    };
    this.move = function()
    {
        this.angle = culcAngel(this.angle, charInDeg(this.towerState), this.rotateStep);
        this.lastFireTime++;
        g_gameField[this.y][this.x] = NOTHING_CHAR;
        var residueX = this.drawingX - this.x * SQUARE_SIZE;
        var residueY = this.drawingY - this.y * SQUARE_SIZE;
        if(residueX  == 0 && residueY  == 0)
        {
            this.bodyAngle = culcBodyAngle(this.bodyAngle, charInDeg(this.routeBefor), this.rotateSpeed);
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && currentChar(this.angle, this.towerState) &&
            residueX  == 0 && residueY  == 0)
        {
            if (this.towerState == "u")
            {
                g_Balls[g_Balls.length] = new Ball(this.x, this.y - 1, this.towerState);
            }
            else if (this.towerState == "d")
            {
                g_Balls[g_Balls.length] = new Ball(this.x, this.y + 1, this.towerState);
            }
            else if (this.towerState == "r")
            {
                g_Balls[g_Balls.length] = new Ball(this.x + 1, this.y, this.towerState);
            }
            else if (this.towerState == "l")
            {
                g_Balls[g_Balls.length] = new Ball(this.x - 1, this.y, this.towerState);
            }
            this.lastFireTime = 0;
            this.fire = false;
        }
        if ((degInChar(this.bodyAngle) == "r" || degInChar(this.bodyAngle) == "l") &&
            (this.motion == "r" && residueY == 0  || this.motionBefore == "r") &&
            (g_gameField[this.y][this.x + 1] == NOTHING_CHAR ||
             residueX != 0))
        {
            if (isTankCell(this.x + 1, this.y) ||
                g_gameField[this.y][this.x + 1] == PLAYER_CHAR)
            {
                this.motionBefore = "l";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "r";
                this.drawingX += this.speed;
                residueX = this.drawingX - this.x * SQUARE_SIZE;
                if (Math.abs(residueX) >= Math.floor(SQUARE_SIZE / 2))
                {
                    this.x++;
                }
                if (residueX == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if ((degInChar(this.bodyAngle) == "u" || degInChar(this.bodyAngle) == "d") &&
                 (this.motion == "d" && residueX == 0 || this.motionBefore == "d") &&
                 (g_gameField[this.y + 1][this.x] == NOTHING_CHAR ||
                  residueY != 0))
        {
            if (isTankCell(this.x, this.y + 1) ||
                g_gameField[this.y + 1][this.x] == PLAYER_CHAR)
            {
                this.motionBefore = "u";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "d";
                this.drawingY += this.speed;
                residueY = this.drawingY - this.y * SQUARE_SIZE;
                if (Math.abs(residueY) >= Math.floor(SQUARE_SIZE / 2))
                {
                    this.y++;
                }
                if (residueY == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if ((degInChar(this.bodyAngle) == "r" || degInChar(this.bodyAngle) == "l") &&
                 (this.motion == "l" && residueY == 0 || this.motionBefore == "l") &&
                 (g_gameField[this.y][this.x - 1] == NOTHING_CHAR ||
                  residueX != 0))
        {
            if (isTankCell(this.x - 1, this.y) ||
                g_gameField[this.y][this.x - 1] == PLAYER_CHAR)
            {
                this.motionBefore = "r";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "l";
                this.drawingX -= this.speed;
                residueX = this.drawingX - this.x * SQUARE_SIZE;
                if (Math.abs(residueX) >= Math.floor(SQUARE_SIZE / 2))
                {
                    this.x--;
                }
                if (residueX == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if ((degInChar(this.bodyAngle) == "u" || degInChar(this.bodyAngle) == "d") &&
                 (this.motion == "u" && residueX == 0 || this.motionBefore == "u") &&
                 (g_gameField[this.y - 1][this.x] == NOTHING_CHAR ||
                  residueY != 0))
        {
            if (isTankCell(this.x, this.y - 1) ||
                g_gameField[this.y - 1][this.x ] == PLAYER_CHAR)
            {
                this.motionBefore = "d";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "u";
                this.drawingY -= this.speed;
                residueY = this.drawingY - this.y * SQUARE_SIZE;
                if (Math.abs(residueY) >= Math.floor(SQUARE_SIZE / 2))
                {
                    this.y--;
                }
                if (residueY == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else
        {
            this.motion = NOTHING_CHAR;
        }
        var x;
        var y;
        if (this.health <= 1)
        {
            for (var i = 0; i < SMOKE_COUNT; ++i)
            {
                x = this.drawingX + SQUARE_SIZE * 0.5;
                var y = this.drawingY + SQUARE_SIZE * 0.5;
                x += randNumbFrom(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.cos(inRad(this.bodyAngle));
                y += randNumbFrom(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.sin(inRad(this.bodyAngle));
                if ((degInChar(this.bodyAngle) == "u" || (degInChar(this.bodyAngle) == "d")))
                {
                    x += randNumbFrom(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
                }
                if ((degInChar(this.bodyAngle) == "r" || (degInChar(this.bodyAngle) == "l")))
                {
                    y += randNumbFrom(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
                }
                g_Smoke[g_Smoke.length] = new DynamicParticle(g_smokeImg, x, y,
                                                              0, 0,
                                                              LAST_X_SMOKE_STATE, LAST_Y_SMOKE_STATE,
                                                              SQUARE_SIZE / 2, SQUARE_SIZE / 2);
            }
        }
        if (residueX != 0 || residueY != 0 || !isDegCel(this.bodyAngle))
        {
            for (var i = 0; i < DUST_COUNT; ++i)
            {
                if (!isDegCel(this.bodyAngle))
                {
                    var angle = this.bodyAngle + (randSign() >= 0) * 180;
                    if (this.bodyAngle >= charInDeg(this.routeBefor) && (charInDeg(this.routeBefor) != 0 || this.bodyAngle <= 180))
                    {
                        angle = inRad(angle);
                        x = SQUARE_SIZE * 0.25 * Math.cos(angle + Math.PI * 3 / 2);
                        y = SQUARE_SIZE * 0.25 * Math.sin(angle + Math.PI * 3 / 2);
                    }
                    else
                    {
                        angle = inRad(angle);
                        x = SQUARE_SIZE * 0.25 * Math.cos(angle + Math.PI / 2);
                        y = SQUARE_SIZE * 0.25 * Math.sin(angle + Math.PI / 2);
                    }
                    var radius = randNumbFrom(0, SQUARE_SIZE / 2.25)
                    x += this.drawingX + SQUARE_SIZE * 0.5 + Math.cos(angle) * radius;
                    y += this.drawingY + SQUARE_SIZE * 0.5 + Math.sin(angle) * radius;
                }
                else if (this.motionBefore == "d")
                {
                    x = this.drawingX + SQUARE_SIZE / 4 + randNumbFrom(0, SQUARE_SIZE / 2);
                    y = this.drawingY + SQUARE_SIZE + randNumbFrom(-SQUARE_SIZE, 0);
                }
                else if (this.motionBefore == "u")
                {
                    x = this.drawingX + SQUARE_SIZE / 4 + randNumbFrom(0, SQUARE_SIZE / 2);
                    y = this.drawingY + randNumbFrom(0, SQUARE_SIZE);
                }
                else if (this.motionBefore == "r")
                {
                    y = this.drawingY + SQUARE_SIZE / 4 + randNumbFrom(0, SQUARE_SIZE / 2);
                    x = this.drawingX + SQUARE_SIZE + randNumbFrom(-SQUARE_SIZE, 0);
                }
                else if (this.motionBefore == "l")
                {
                    y = this.drawingY + SQUARE_SIZE / 4 + randNumbFrom(0, SQUARE_SIZE / 2);
                    x = this.drawingX + randNumbFrom(0, SQUARE_SIZE);
                }
                g_Dust[g_Dust.length] = new DynamicParticle( g_dustImg,x, y, 0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, SQUARE_SIZE / 40, SQUARE_SIZE / 40);
            }
        }
        g_gameField[this.y][this.x] = this.character;
    };
    this.draw = function()
    {
        g_ctx.translate(this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE);
        g_ctx.rotate(inRad(this.bodyAngle));
        g_ctx.drawImage(this.body, Math.floor(-SQUARE_SIZE / 2), Math.floor(-SQUARE_SIZE / 2), SQUARE_SIZE, SQUARE_SIZE);
        g_ctx.rotate(-inRad(this.bodyAngle));
        g_ctx.rotate(inRad(this.angle));
        g_ctx.drawImage(this.tower, Math.floor(-this.towerHeight / 2), Math.floor(-this.towerHeight / 2), this.towerWidth, this.towerHeight);
        g_ctx.rotate(-inRad(this.angle));
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
            g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        var isDamaged = culcHealth(this.x, this.y);
        if (g_gameField[this.y][this.x] == NOTHING_CHAR || isDamaged)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        if (g_gameField[this.y][this.x] == BARRICADE_CHAR)
        {
            return 1;
        }
        g_gameField[this.y][this.x] = NOTHING_CHAR;
        switch (this.route)
        {
            case "u":
                if (g_gameField[this.y - 1][this.x] == BARRICADE_CHAR)
                {
                    g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
                    return 1;
                }
                this.y--;
                break;
            case "d":
                if (g_gameField[this.y + 1][this.x] == BARRICADE_CHAR)
                {
                    g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
                    return 1;
                }
                this.y++;
                break;
            case "r":
                if (g_gameField[this.y][this.x + 1] == BARRICADE_CHAR)
                {
                    g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
                    return 1;
                }
                this.x++;
                break;
            case "l":
                if (g_gameField[this.y][this.x - 1] == BARRICADE_CHAR)
                {
                    g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
                    return 1;
                }
                this.x--;
                break;
        }
        if (g_gameField[this.y][this.x] == BALL_CHAR)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            return 1;
        }
        if (g_gameField[this.y][this.x] == TRAVELED_BARRICADE_CHAR)
        {
            g_gameField[this.y][this.x] = NOTHING_CHAR;
            g_AllBangs[g_AllBangs.length] = new Bang(this.x, this.y);
            return 1;
        }
        g_gameField[this.y][this.x] = BALL_CHAR;
        return 0;
    }
    this.draw = function()
    {
        g_ctx.translate((this.x + 0.5) * SQUARE_SIZE, (this.y + 0.5) * SQUARE_SIZE);
        g_ctx.rotate(inRad(charInDeg(this.route)));
        g_ctx.drawImage(g_ballImg, -SQUARE_SIZE / 8, -SQUARE_SIZE / 8, SQUARE_SIZE / 3, SQUARE_SIZE / 3);
        g_ctx.rotate(-inRad(charInDeg(this.route)));
        g_ctx.translate(-(this.x + 0.5) * SQUARE_SIZE, -(this.y + 0.5) * SQUARE_SIZE);
    }
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
            var finalX = randNumbFrom(-this.fireRadius, this.fireRadius);
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