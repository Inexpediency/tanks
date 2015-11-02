/**
 * Created by Vasiliy on 9/30/2015.
 */
function Player(cordX, cordY, towerState, persChar, consts)
{
    this.initDefault = function()
    {
        this.speed = consts.speedPatrol;
        this.rotateSpeed = culcRotateSpeed(this.speed);
        this.normalSpeed = consts.speedNormal;
        this.patrolSpeed = consts.speedPatrol;
        this.angle = charInDegres(towerState);
        this.bodyAngle = charInDegres(towerState);
        this.rotateStep = consts.rotateTowerSpeed;
        this.fire = false;
        this.character = persChar;
        this.routeBefor = towerState;
        this.foundRadius = consts.foundRadius;
        this.health = consts.health;
        this.lastFireTime = 0;
        this.towerHeight = SQUARE_SIZE / 3;
        this.towerWidth = SQUARE_SIZE / 1.5;
        this.motion = NOTHING_CHAR;
        this.x = cordX;
        this.y = cordY;
        this.motionBefore = NOTHING_CHAR;
        this.drawingX = this.x * SQUARE_SIZE;
        this.drawingY = this.y * SQUARE_SIZE;
        this.towerState = towerState;
    };
    this.move = function()
    {
        this.angle = culcAngel(this.angle, charInDegres(this.towerState), this.rotateStep);
        this.lastFireTime++;
        g_gameField[this.y][this.x] = NOTHING_CHAR;
        var residueX = this.drawingX - this.x * SQUARE_SIZE;
        var residueY = this.drawingY - this.y * SQUARE_SIZE;
        if(residueX  == 0 && residueY  == 0)
        {
            this.bodyAngle = culcBodyAngle(this.bodyAngle, charInDegres(this.routeBefor), this.rotateSpeed);
        }
        if (this.fire && this.lastFireTime > consts.reloadingTime && currentChar(this.angle, this.towerState))
        {
            if (this.towerState == "u")
            {
                g_Balls[g_Balls.length] = new Ball(this.x, this.y - 1, this.towerState);
                console.log(g_gameField[this.y - 1][this.x]);
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
        if (isDegCel(this.bodyAngle) && (this.motion == "r" && residueY == 0  || this.motionBefore == "r") &&
            (g_gameField[this.y][this.x + 1] == NOTHING_CHAR ||
             residueX != 0))
        {
            if (isTankCell(this.x + 1, this.y))
            {
                this.motionBefore = "l";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "r";
                this.drawingX += this.speed;
                residueX = this.drawingX - this.x * SQUARE_SIZE;
                if (Math.abs(residueX) >= (SQUARE_SIZE - SQUARE_SIZE % 2) / 2)
                {
                    this.x++;
                }
                if (residueX == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if (isDegCel(this.bodyAngle) && (this.motion == "d" && residueX == 0 || this.motionBefore == "d") &&
                 (g_gameField[this.y + 1][this.x] == NOTHING_CHAR ||
                  residueY != 0))
        {
            if (isTankCell(this.x, this.y + 1))
            {
                this.motionBefore = "u";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "d";
                this.drawingY += this.speed;
                residueY = this.drawingY - this.y * SQUARE_SIZE;
                if (Math.abs(residueY) >= (SQUARE_SIZE - SQUARE_SIZE % 2) / 2)
                {
                    this.y++;
                }
                if (residueY == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if (isDegCel(this.bodyAngle) && (this.motion == "l" && residueY == 0 || this.motionBefore == "l") &&
                 (g_gameField[this.y][this.x - 1] == NOTHING_CHAR ||
                  residueX != 0))
        {
            if (isTankCell(this.x - 1, this.y))
            {
                this.motionBefore = "r";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "l";
                this.drawingX -= this.speed;
                residueX = this.drawingX - this.x * SQUARE_SIZE;
                if (Math.abs(residueX) >= (SQUARE_SIZE - SQUARE_SIZE % 2) / 2)
                {
                    this.x--;
                }
                if (residueX == 0)
                {
                    this.motionBefore = NOTHING_CHAR;
                }
            }
        }
        else if (isDegCel(this.bodyAngle) && (this.motion == "u" && residueX == 0 || this.motionBefore == "u") &&
                 (g_gameField[this.y - 1][this.x] == NOTHING_CHAR ||
                  residueY != 0))
        {
            if (isTankCell(this.x, this.y - 1))
            {
                this.motionBefore = "d";
                this.motion = NOTHING_CHAR;
            }
            else
            {
                this.motionBefore = "u";
                this.drawingY -= this.speed;
                residueY = this.drawingY - this.y * SQUARE_SIZE;
                if (Math.abs(residueY) >= (SQUARE_SIZE - SQUARE_SIZE % 2) / 2)
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
        g_gameField[this.y][this.x] = this.character;
    };
    this.draw = function()
    {
        g_ctx.translate(this.drawingX + 0.5 * SQUARE_SIZE, this.drawingY + 0.5 * SQUARE_SIZE);
        g_ctx.rotate(inRad(this.bodyAngle));
        g_ctx.drawImage(g_tankBody, Math.floor(-SQUARE_SIZE / 2), Math.floor(-SQUARE_SIZE / 2), SQUARE_SIZE, SQUARE_SIZE)
        g_ctx.rotate(-inRad(this.bodyAngle));
        g_ctx.rotate(inRad(this.angle));
        if (this.character == PLAYER_CHAR)
        {
            g_ctx.drawImage(g_towerPlayer, Math.floor(-this.towerHeight / 2), Math.floor(-this.towerHeight / 2), this.towerWidth, this.towerHeight);
        }
        else
        {
            g_ctx.drawImage(g_towerEnemy, Math.floor(-this.towerHeight / 2), Math.floor(-this.towerHeight / 2), this.towerWidth, this.towerHeight);
        }
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
            //console.log("f");
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
            this.fireParticles[this.fireParticles.length] = new Spark(startX, startY, finalX + startX, finalY + startY);
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

function Spark(x, y, finalX, finalY)
{
    this.x = x;
    this.y = y;
    this.speedY = (finalY - y) / SPARK_SPEED;
    this.speedX = (finalX - x) / SPARK_SPEED;
    this.stateX = 0;
    this.stateY = 0;
    this.sparkWidth = g_sparkImg.width / (LAST_X_SPARK_STATE + 1);
    this.sparkHeight = g_sparkImg.height / (LAST_Y_SPARK_STATE + 1);
    this.move = function()
    {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.draw = function()
    {
        g_ctx.drawImage(
            g_sparkImg,
            this.sparkWidth * this.stateX,
            this.sparkHeight * this.stateY, this.sparkWidth, this.sparkHeight, this.x - 10, this.y - 10,
            (SQUARE_SIZE  - SQUARE_SIZE % 3) / 3,
            (SQUARE_SIZE  - SQUARE_SIZE % 3) / 3);
        if (++this.stateX > LAST_X_SPARK_STATE)
        {
            this.stateX = 0;
            if (++this.stateY > LAST_Y_SPARK_STATE)
            {
                return 1;
            }
        }
        return 0;
    };
}