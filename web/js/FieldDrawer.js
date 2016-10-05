/**
 * Created by Vasiliy on 6/23/2016.
 */
function FieldDrawer(canvas)
{
    var ELEMENT_X_SIZE = 100;
    var ELEMENT_Y_SIZE = 100;
    var BONUS_WIDTH = 32;
    var BONUS_HEIGHT = 32;
    var BANG_WIDTH = 256;
    var BANG_HEIGHT = 256;

    this.playerX = 0;
    this.playerY = 0;
    this.dust = [];
    this.smoke = [];

    var tankTower = new Image();
    tankTower.src = TANK_TOWER_ADDRESS;
    var tankBody = new Image();
    tankBody.src = TANK_BODY_ADDRESS;
    var smokeImg = new Image();
    smokeImg.src = SMOKE_ADDRESS;
    var dustImg = new Image();
    dustImg.src = DUST_ADDRESS;
    var ballImg = new Image();
    ballImg.src = BALL_ADDRESS;
    var traveledBarricadeImg = new Image();
    traveledBarricadeImg.src = TRAVELED_BARRICADE_ADDRESS;
    var barricadeImg = new Image();
    barricadeImg.src = BARRICADE_ADDRESS;
    var healthBonus = new Image();
    healthBonus.src = HEALTH_BONUS_ADDRESS;
    var speedBonus = new Image();
    speedBonus.src = SPEED_BONUS_ADDRESS;
    var towerSpeedBonus = new Image();
    towerSpeedBonus.src = TOWER_SPEED_BONUS_ADDRESS;
    var fireSpeedBonus = new Image();
    fireSpeedBonus.src = FIRE_SPEED_BONUS_ADDRESS;
    var bangImg = new Image();
    bangImg.src = BANG_ADDRESS;

    this.draw = function(field, player)
    {
        this.initField(player);
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.callDrawFromArr(this.dust);
        this.drawBall(field.balls);
        this.drawBarricades(field.barricades);
        this.drawTanks(field.tanks);
        this.drawBonus(field.bonus);
        this.drawBang(field.bangs);
        this.callDrawFromArr(this.smoke);
    };

    this.moveField = function(player, movedX, movedY)
    {
        if (this.isAngelRight(player.angle) &&
           (player.motion == this._translateRightDegInChar(player.angle) ||
            this._reverseChar(player.motion) == this._translateRightDegInChar(player.angle)))
        {
            var courseX = this._getXDirect(player.motion) * player.speed * ELEMENT_X_SIZE / ELEMENT_SIZE;
            var courseY = this._getYDirect(player.motion) * player.speed * ELEMENT_Y_SIZE / ELEMENT_SIZE;
            var field = $("#gameField");
            if (movedX)
            {

                player.cameraMovedX = movedX;
                var backgroundPositionX = field.css("background-position-x");
                field.css("background-position-x", (parseInt(backgroundPositionX) - courseX) + "px");
            }
            if (movedY)
            {
                player.cameraMovedY = movedY;
                var backgroundPositionY = field.css("background-position-y");
                field.css("background-position-y", (parseInt(backgroundPositionY) - courseY) + "px");
            }
        }
    };

    this.drawBarricades = function(arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            var barricade = arr[i].character == TRAVELED_BARRICADE_CHAR ? traveledBarricadeImg : barricadeImg;
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            this._drawRotatedObj(arr[i].angle, barricade, x, y,
                ELEMENT_X_SIZE, ELEMENT_Y_SIZE, ELEMENT_X_SIZE / 2, ELEMENT_Y_SIZE / 2);
        }
    };

    this.drawBonus = function(arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            this.ctx.drawImage(
                this._getBonusImageByChar(arr[i].character),
                BONUS_WIDTH * arr[i].stageX,
                BONUS_HEIGHT * arr[i].stageY,
                BONUS_WIDTH, BONUS_HEIGHT,
                x - ELEMENT_X_SIZE / 2, y - ELEMENT_Y_SIZE / 2,
                ELEMENT_X_SIZE, ELEMENT_Y_SIZE);
        }
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

    this.drawBang = function(arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            this.ctx.drawImage(
                bangImg,
                BANG_WIDTH * arr[i].stageX,
                BANG_HEIGHT * arr[i].stageY,
                BANG_WIDTH, BANG_HEIGHT,
                x - ELEMENT_X_SIZE / 2, y - ELEMENT_Y_SIZE / 2,
                ELEMENT_X_SIZE, ELEMENT_Y_SIZE);
        }
    };

    this.drawBall = function(arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            var width = ELEMENT_X_SIZE * arr[i].width / ELEMENT_SIZE;
            var height = ELEMENT_Y_SIZE * arr[i].height / ELEMENT_SIZE;
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            this._drawRotatedObj(this._translateCharInRightDeg(arr[i].route), ballImg, x, y, width, height, width / 2, height / 2);
        }
    };

    this.drawTanks = function(arr)
    {
        var towerWidth = ELEMENT_X_SIZE / 1.5;
        var towerHeight = ELEMENT_Y_SIZE / 3.5;
        var bodyWidth = ELEMENT_X_SIZE;
        var bodyHeight = ELEMENT_Y_SIZE / 2;
        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].motion != NOTHING_CHAR || !this.isAngelRight(arr[i].angle))
            {
                this._createDust(arr[i]);
            }
            if (arr[i].health == 1)
            {
                this._createSmoke(arr[i]);
            }
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            this._drawRotatedObj(arr[i].angle, tankBody, x, y, bodyWidth, bodyHeight, bodyWidth / 2, bodyHeight / 2);
            this._drawRotatedObj(arr[i].towerAngle, tankTower, x, y, towerWidth, towerHeight, towerWidth / 5, towerHeight / 2);
        }
    };

    this._getXDirect = function(char)
    {
        if (char == RIGHT_CHAR)
        {
            return 1;
        }
        else if (char == LEFT_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this._getYDirect = function(char)
    {
        if (char == DOWN_CHAR)
        {
            return 1;
        }
        else if (char == UP_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this.initField= function(player)
    {
        var fieldXMoved = false;
        var fieldYMoved = false;
        this.playerX = player.x;
        this.playerY = player.y;
        this.alignX = player.x * ELEMENT_X_SIZE / ELEMENT_SIZE;
        this.alignY = player.y * ELEMENT_Y_SIZE / ELEMENT_SIZE;
        if (this.alignX > canvas.width / 2)
        {
            if (ELEMENT_X_SIZE * FIELD_X_SIZE - this.alignX < canvas.width / 2)
            {
                this.alignX = canvas.width - ELEMENT_X_SIZE * FIELD_X_SIZE + this.alignX;
            }
            else
            {
                fieldXMoved = true;
                this.alignX = canvas.width / 2;
            }
        }
        if (this.alignY > canvas.height / 2)
        {
            if (ELEMENT_Y_SIZE * FIELD_Y_SIZE - this.alignY < canvas.height / 2)
            {
                this.alignY = canvas.height - ELEMENT_Y_SIZE * FIELD_Y_SIZE + this.alignY;
            }
            else
            {
                fieldYMoved = true;
                this.alignY = canvas.height / 2;
            }
        }
        this.moveField(player, fieldXMoved, fieldYMoved);
    };

    this.initCanvas = function()
    {
        var width = 0.7;
        canvas.width = parseInt($(window).width()) * width;
        $(canvas).css("left", (1 - width) * 50 + "%");
        canvas.height = canvas.width / FIELD_X_SIZE * FIELD_Y_SIZE;
        return canvas.getContext("2d");
    };

    this.callDrawFromArr = function(arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            var x = this._getValidCordX(arr[i].x);
            var y = this._getValidCordY(arr[i].y);
            if (arr[i].draw(x, y))
            {
                arr.splice(i, 1);
            }
        }
    };

    this._getBonusImageByChar = function(char)
    {
        if (char == HEALTH_BONUS_CHAR)
        {
            return healthBonus;
        }
        else if (char == TOWER_SPEED_BONUS_CHAR)
        {
            return towerSpeedBonus;
        }
        else if (char == FIRE_SPEED_BONUS_CHAR)
        {
            return fireSpeedBonus;
        }
        else
        {
            return speedBonus;
        }
    };

    this._createSmoke = function(tank)
    {
        var calcX;
        var calcY;
        for (var i = 0; i < SMOKE_COUNT; ++i)
        {
            calcX = tank.x;
            calcY = tank.y;
            calcX += this.randNumb(-ELEMENT_Y_SIZE / 8, ELEMENT_Y_SIZE / 8) * Math.cos(this.inRad(tank.angle));
            calcY += this.randNumb(-ELEMENT_Y_SIZE / 8, ELEMENT_Y_SIZE / 8) * Math.sin(this.inRad(tank.angle));
            if ((this._getCurrentChar(tank.angle) == UP_CHAR || (this._getCurrentChar(tank.angle) == DOWN_CHAR)))
            {
                calcX += this.randNumb(-ELEMENT_X_SIZE / 12, ELEMENT_Y_SIZE / 12)
            }
            if ((this._getCurrentChar(tank.angle) == RIGHT_CHAR || (this._getCurrentChar(tank.angle) == LEFT_CHAR)))
            {
                calcY += this.randNumb(-ELEMENT_X_SIZE / 12, ELEMENT_Y_SIZE / 12)
            }
            this.smoke[this.smoke.length] = new DynamicParticle(smokeImg, calcX, calcY,
                0, 0,
                LAST_X_SMOKE_STATE, LAST_Y_SMOKE_STATE,
                ELEMENT_X_SIZE / 2, ELEMENT_Y_SIZE / 2);
        }
    };

    this._createDust = function(tank)
    {
        var calcX;
        var calcY;
        var calcAngle;
        var finalAngle = this._translateCharInRightDeg(tank.finalBodeState);
        for (var i = 0; i < DUST_COUNT; ++i)
        {
            calcX = tank.x;
            calcY = tank.y;
            var width = this._getTankWidthByMotion(tank.motion);
            var height = this._getTankHeightByMotion(tank.motion);
            if (!this.isAngelRight(tank.angle))
            {
                calcAngle = tank.angle + (Math.random() >= 0.5) * 180;
                calcAngle = this.inRad(calcAngle);
                if (tank.angle < finalAngle || (finalAngle == 0 && tank.angle >= 180))
                {
                    calcY += ELEMENT_Y_SIZE * 0.125 * Math.cos(calcAngle);
                    calcX -= ELEMENT_X_SIZE * 0.125 * Math.sin(calcAngle);
                }
                else
                {
                    calcY -= ELEMENT_X_SIZE * 0.125 * Math.cos(calcAngle);
                    calcX += ELEMENT_Y_SIZE * 0.125 * Math.sin(calcAngle);
                }
                var radius = this.randNumb(0, ELEMENT_Y_SIZE / 3.5);
                calcX += Math.cos(calcAngle) * radius;
                calcY += Math.sin(calcAngle) * radius;
            }
            else
            {
                calcX += this.randNumb(-width, width);
                calcY += this.randNumb(-height, height);
            }
            this.dust[this.dust.length] = new DynamicParticle(dustImg, calcX, calcY,
                0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, ELEMENT_X_SIZE / 40, ELEMENT_Y_SIZE / 40);
        }
    };

    this._getTankHeightByMotion = function(motion)
    {
        if (motion == UP_CHAR || motion == DOWN_CHAR)
        {
            return ELEMENT_X_SIZE / 4;
        }
        else
        {
            return ELEMENT_X_SIZE / 6;
        }
    };

    this._getTankWidthByMotion = function(motion)
    {
        if (motion == LEFT_CHAR || motion == RIGHT_CHAR)
        {
            return ELEMENT_Y_SIZE / 4;
        }
        else
        {
            return ELEMENT_Y_SIZE / 6;
        }
    };

    this._getValidCordX = function(x)
    {
        x = (x - this.playerX);
        x = x * ELEMENT_X_SIZE / ELEMENT_SIZE;
        return x + this.alignX;
    };

    this._getValidCordY = function(y)
    {
        y = (y - this.playerY);
        y = y * ELEMENT_Y_SIZE / ELEMENT_SIZE;
        return y + this.alignY;
    };

    this._drawRotatedObj = function(angle, img, x, y, w, h, RotationAxisX, RotationAxisY)
    {
        this.ctx.translate(x, y);
        this.ctx.rotate(this.inRad(angle));
        this.ctx.drawImage(img, -RotationAxisX, -RotationAxisY, w, h);
        this.ctx.rotate(-this.inRad(angle));
        this.ctx.translate(-x, -y);
    };

    this.inRad = function(angle)
    {
        return -angle / 180 * Math.PI;
    };

    this._translateCharInRightDeg = function(char)
    {
        if (char == UP_CHAR)
        {
            return 90;
        }
        else if (char == LEFT_CHAR)
        {
            return 180;
        }
        else if (char == DOWN_CHAR)
        {
            return 270;
        }
        else if (char == RIGHT_CHAR)
        {
            return 0;
        }
        return NaN;
    };

    this._translateRightDegInChar = function(char)
    {
        if (char == 90)
        {
            return UP_CHAR;
        }
        else if (char == 180)
        {
            return LEFT_CHAR;
        }
        else if (char == 270)
        {
            return DOWN_CHAR;
        }
        else if (char == 0)
        {
            return RIGHT_CHAR;
        }
        return NaN;
    };

    this.isAngelRight = function(angle)
    {
        return angle == 0 ||
            angle == 90 ||
            angle == 180||
            angle == 270 ||
            angle == 360
    };

    this.randNumb = function(min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
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

    this.ctx = this.initCanvas();
}