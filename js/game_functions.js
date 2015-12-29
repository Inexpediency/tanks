/**
 * Created by Vasiliy on 10/4/2015.
 */

function copyArray(arr)
{
    var result = [];
    for (var i = 0; i < arr.length; ++i)
    {
        result[i] = arr[i].slice();
    }
    return result;
}

function isTankAtCell(x, y)
{
    return g_gameField[y][x] == ARMOR_ENEMY_CHAR ||
           g_gameField[y][x] == SPRINT_ENEMY_CHAR ||
           g_gameField[y][x] == ENEMY_CHAR;
}

function initHealthBlock()
{
    var health = new Image();
    health.src = HEALTH_ADDRES;
    $(health).load(function()
    {
        $("#health").width(health.width * MAX_VISIBLE_HEALTH + "px");
        $("#controlPanel").width(255 + parseInt($("#health").width()) + "px");
    });
}

function drawPlayerHealth()
{
    var healthBlock = $("#health");
    healthBlock.html("");
    if (g_player.health > MAX_VISIBLE_HEALTH)
    {
        var health = new Image();
        health.src = HEALTH_ADDRES;
        healthBlock.append(health, " x" + g_player.health);
    }
    else
    {
        for (var i = 0; i < g_player.health; ++i)
        {
            var health = new Image();
            health.src = HEALTH_ADDRES;
            healthBlock.append(health);
        }
    }
}

function isTowerPosRight(angle, towerState)
{
    return angle == 0 && towerState == RIGHT_CHAR||
           angle == 90 && towerState == UP_CHAR||
           angle == 180 && towerState == LEFT_CHAR||
           angle == 270 && towerState == DOWN_CHAR
}

function isAngelRight(angle)
{
    return angle == 0 ||
           angle == 90 ||
           angle == 180||
           angle == 270 ||
           angle == 360
}

function getCurrentChar(deg)
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
}

function getXDirect(char)
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
}

function getYDirect(char)
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
}

function reverseChar(char)
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
}

function translateCharInRightDeg(char)
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
}

function inRad(angle)
{
    return -angle / 180 * Math.PI;
}

function translateDividers(transleted, resultSystem)
{
    var factorNumbCount = 0;
    for (var i = 2; i <= transleted; i++)
    {
        if (transleted % i == 0)
        {
            factorNumbCount++;
        }
    }
    for (var i = 2; i <= resultSystem; i++)
    {
        if (resultSystem % i == 0)
        {
            factorNumbCount--;
            if (factorNumbCount <= 0)
            {
                return i;
            }
        }
    }
    return 90;
}

function calcBodyAngle(startAngle, finalAngle, step)
{
    var finAngle = finalAngle == 0 && startAngle > 180 ? 360 : finalAngle;
    var stAngle = startAngle == 360 && finalAngle <= 180 ? 0 : startAngle;
    stAngle = startAngle == 0 && finalAngle > 180 ? 360 : startAngle;
    if (stAngle != finAngle &&
        Math.abs(stAngle - finAngle) != 180)
    {
        if (stAngle < finAngle)
        {
            return stAngle + step;
        }
        else
        {
            return stAngle - step;
        }
    }
    return stAngle;
}

function calcTowerAngel(startAngle, finalAngle, currentStep)
{
    var finAngle = finalAngle == 0 && startAngle > 180 ? 360 : finalAngle;
    if (startAngle != finAngle)
    {
        var stAngle = startAngle == 360 && finalAngle <= 180 ? 0 : startAngle;
        stAngle = startAngle == 0 && finalAngle > 180 ? 360 : startAngle;
        if (stAngle < finAngle)
        {
            return stAngle + currentStep;
        }
        else
        {
            return stAngle - currentStep;
        }
    }
    else
    {
        return startAngle == 360 ? 0 : startAngle;
    }
}

function moveTank(tank)
{
    g_gameField[tank.y][tank.x] = NOTHING_CHAR;
    if (getCurrentChar(tank.bodyAngle) != null && tank.motionBefore == NOTHING_CHAR)
    {
        tank.motionBefore = tank.motion;
    }
    var stepX = getXDirect(tank.motionBefore);
    var stepY = getYDirect(tank.motionBefore);
    tank.drawingX += stepX * tank.speed;
    tank.drawingY += stepY * tank.speed;
    tank.x += stepX;
    tank.y += stepY;
    residueX = tank.drawingX % SQUARE_SIZE;
    residueY = tank.drawingY % SQUARE_SIZE;
    if ((residueY < SQUARE_SIZE / 2 && stepY < 0) || (residueY > SQUARE_SIZE / 2 && stepY > 0))
    {
        tank.y -= stepY;
    }
    if ((residueX < SQUARE_SIZE / 2 && stepX < 0) || (residueX > SQUARE_SIZE / 2 && stepX > 0))
    {
        tank.x -= stepX;
    }
    if (g_gameField[tank.y][tank.x] != NOTHING_CHAR && tank.isTankReturn)
    {
        tank.motionBefore = reverseChar(tank.motionBefore);
        tank.motion = NOTHING_CHAR;
        tank.isTankReturn = 0;
    }
    if (tank.drawingX % SQUARE_SIZE == 0 && tank.drawingY % SQUARE_SIZE == 0)
    {
        tank.motionBefore = NOTHING_CHAR;
        tank.isTankReturn = 1;
    }
    if ((residueY > SQUARE_SIZE / 2 && stepY < 0) || (residueY < SQUARE_SIZE / 2 && stepY > 0))
    {
        tank.y -= stepY;
    }
    if ((residueX > SQUARE_SIZE / 2 && stepX < 0) || (residueX < SQUARE_SIZE / 2 && stepX > 0))
    {
        tank.x -= stepX;
    }
    g_gameField[tank.y][tank.x] = tank.character;
}

function moveEnemy()
{
    for (var i = 0; i < g_enemy.length; i++)
    {
        calcMoving(g_enemy[i]);
        g_enemy[i].move();
    }
}

function moveBangs()
{
    for (var i = 0; i < g_bangs.length; i++)
    {
        if (g_bangs[i].move())
        {
            g_bangs.splice(i, 1);
        }
    }
}

function drawBangs()
{
    for (var i = 0; i < g_bangs.length; i++)
    {
        g_bangs[i].draw();
    }
}

function drawStaticParticle(mas)
{
    for (var i = 0; i < mas.length; i++)
    {
        if (mas[i].draw())
        {
            mas.splice(i, 1);
        }
    }
}

function moveBalls()
{
    for (var i = 0; i < g_balls.length; i++)
    {
        if (g_balls[i].move())
        {
            g_balls.splice(i, 1);
        }
    }
}

function calcHealth(x, y)
{
    if (g_gameField[y][x] == PLAYER_CHAR)
    {
        if (g_player.health > 0)
        {
            g_player.health--;
        }
        g_gameField[y][x] = PLAYER_CHAR;
        return 1;
    }
    else if (isTankAtCell(x, y))
    {
        var woundedEnemy = findElement(x, y, g_enemy);
        if (g_enemy[woundedEnemy].health - 1 > 0)
        {
            g_enemy[woundedEnemy].health--;
            g_gameField[y][x] = woundedEnemy.character;
        }
        else
        {
            g_enemy.splice(woundedEnemy, 1);
        }
        return 1;
    }
    return 0;
}

function drawGrid()
{
    g_ctx.strokeStyle = GRID_COLOR;
    g_ctx.beginPath();
    for (var i = 0; i < g_gameField[0].length; ++i)
    {
        g_ctx.moveTo(i * SQUARE_SIZE, 0);
        g_ctx.lineTo(i * SQUARE_SIZE, g_canvas.height);
    }
    for (var i = 0; i < g_gameField.length; ++i)
    {
        g_ctx.moveTo(0, i * SQUARE_SIZE);
        g_ctx.lineTo(g_canvas.width, i * SQUARE_SIZE);
    }
    g_ctx.stroke();
}

function findElement(x, y, mas)
{
    for (var i = 0; i < mas.length; ++i)
    {
        if (x == mas[i].x && y == mas[i].y)
        {
            return i;
        }
    }
}

function checkXFireWay(x, y, finalState)
{
    var sign = x < finalState ? 1 : - 1;
    for (x += sign; x != finalState; x += sign)
    {
        if (g_gameField[y][x] != NOTHING_CHAR)
        {
            return g_gameField[y][x];
        }
    }
    return NOTHING_CHAR;
}

function checkYFireWay(x, y, finalState)
{
    var sign = y < finalState ? 1 : -1;
    for (y += sign; y != finalState; y += sign)
    {
        if (g_gameField[y][x] != NOTHING_CHAR)
        {
            return g_gameField[y][x];
        }
    }
    return NOTHING_CHAR;
}

function calcMoving(enemy)
{
    patrol(enemy);
    if (isPlayerFound(g_player.x, g_player.y, enemy.x, enemy.y))
    {
        fire(enemy);
    }
}

function patrol(enemy)
{
    if (enemy.motion == NOTHING_CHAR && isAngelRight(enemy.bodyAngle))
    {
        var direction = randNumb(0, 4);
        if (direction == 0)
        {
            enemy.motion = RIGHT_CHAR;
            enemy.finalBodeState = RIGHT_CHAR;
            enemy.towerState = RIGHT_CHAR;
        }
        else if (direction == 1)
        {
            enemy.motion = LEFT_CHAR;
            enemy.finalBodeState = LEFT_CHAR;
            enemy.towerState = LEFT_CHAR;
        }
        else if (direction == 2)
        {
            enemy.motion = DOWN_CHAR;
            enemy.finalBodeState = DOWN_CHAR;
            enemy.towerState = DOWN_CHAR;
        }
        else if (direction == 3)
        {
            enemy.motion = UP_CHAR;
            enemy.finalBodeState = UP_CHAR;
            enemy.towerState = UP_CHAR;
        }
    }
}

function fire(enemy)
{
    if (enemy.x == g_player.x)
    {
        if (enemy.y < g_player.y)
        {
            if (checkYFireWay(enemy.x, enemy.y, g_gameField.length) == PLAYER_CHAR)
            {
                enemy.fire = true;
            }
            enemy.towerState = DOWN_CHAR;
        }
        else
        {
            if (checkYFireWay(enemy.x, enemy.y, 0) == PLAYER_CHAR)
            {
                enemy.fire = true;
            }
            enemy.towerState = UP_CHAR;
        }
    }
    else if (enemy.y == g_player.y)
    {
        if (enemy.x - g_player.x > 0)
        {
            if (checkXFireWay(enemy.x, enemy.y, 0) == PLAYER_CHAR)
            {
                enemy.fire = true;
            }
            enemy.towerState = LEFT_CHAR;
        }
        else
        {
            if (checkXFireWay(enemy.x, enemy.y, g_gameField[enemy.y].length) == PLAYER_CHAR)
            {
                enemy.fire = true;}
            enemy.towerState = RIGHT_CHAR;
        }
    }
}

function atack(enemy)
{
    if (enemy.motionBefore == NOTHING_CHAR)
    {
        fire(enemy);
        if (Math.abs(enemy.x - g_player.x) > Math.abs(enemy.y - g_player.y))
        {
            if (enemy.y < g_player.y)
            {
                enemy.motion = DOWN_CHAR;
            }
            else

            {
                enemy.motion = UP_CHAR;
            }
        }
        else
        {
            if (enemy.x > g_player.x)
            {
                enemy.motion = LEFT_CHAR;
            }
            else
            {
                enemy.motion = RIGHT_CHAR;
            }
        }
    }
}

function chase(enemy)
{
    if (enemy.x == g_player.x && g_player.y < enemy.y)
    {
        enemy.motion = UP_CHAR;
    }
    else if (enemy.x == g_player.x && g_player.y > enemy.y)
    {
        enemy.motion = DOWN_CHAR;
    }
    else if (enemy.x < g_player.x && g_player.y == enemy.y)
    {
        enemy.motion = RIGHT_CHAR;
    }
    else if (enemy.x < g_player.x && g_player.y < enemy.y)
    {
        if (enemy.motion == UP_CHAR)
        {
            enemy.motion = RIGHT_CHAR;
        }
        else
        {
            enemy.motion = UP_CHAR;
        }
    }
    else if (enemy.x < g_player.x && g_player.y > enemy.y)
    {
        if (enemy.motion == DOWN_CHAR)
        {
            enemy.motion = RIGHT_CHAR;
        }
        else
        {
            enemy.motion = DOWN_CHAR;
        }
    }
    else if (enemy.x > g_player.x && g_player.y == enemy.y)
    {
        enemy.motion = LEFT_CHAR;
    }
    else if (enemy.x > g_player.x && g_player.y < enemy.y)
    {
        if (enemy.motion == UP_CHAR)
        {
            enemy.motion = LEFT_CHAR;
        }
        else
        {
            enemy.motion = UP_CHAR;
        }
    }
    else if (enemy.x > g_player.x && g_player.y > enemy.y)
    {
        if (enemy.motion == DOWN_CHAR)
        {
            enemy.motion = LEFT_CHAR;
        }
        else
        {
            enemy.motion = DOWN_CHAR;
        }
    }
}

function calcFireDirection(player)
{
    if (player.towerState == UP_CHAR)
    {
        g_balls[g_balls.length] = new Ball(player.x, player.y - 1, player.towerState);
    }
    else if (player.towerState == DOWN_CHAR)
    {
        g_balls[g_balls.length] = new Ball(player.x, player.y + 1, player.towerState);
    }
    else if (player.towerState == RIGHT_CHAR)
    {
        g_balls[g_balls.length] = new Ball(player.x + 1, player.y, player.towerState);
    }
    else if (player.towerState == LEFT_CHAR)
    {
        g_balls[g_balls.length] = new Ball(player.x - 1, player.y, player.towerState);
    }
}

function createSmokeParticles(x, y, angle)
{
    var calcX;
    var calcY;
    for (var i = 0; i < SMOKE_COUNT; ++i)
    {
        calcX = x;
        calcY = y;
        calcX += SQUARE_SIZE * 0.5;
        calcY += SQUARE_SIZE * 0.5;
        calcX += randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.cos(inRad(angle));
        calcY += randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.sin(inRad(angle));
        if ((getCurrentChar(angle) == UP_CHAR || (getCurrentChar(angle) == DOWN_CHAR)))
        {
            calcX += randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
        }
        if ((getCurrentChar(angle) == RIGHT_CHAR || (getCurrentChar(angle) == LEFT_CHAR)))
        {
            calcY += randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
        }
        g_smoke[g_smoke.length] = new DynamicParticle(g_smokeImg, calcX, calcY,
            0, 0,
            LAST_X_SMOKE_STATE, LAST_Y_SMOKE_STATE,
            SQUARE_SIZE / 2, SQUARE_SIZE / 2);
    }
}

function createDustParticles(x, y, finalAngle, angle, motion)
{
    var calcX;
    var calcY;
    var calcAngle;
    for (var i = 0; i < DUST_COUNT; ++i)
    {
        calcX = x;
        calcY = y;
        if (!isAngelRight(angle))
        {
            calcAngle = angle;
            calcX += SQUARE_SIZE * 0.5;
            calcY += SQUARE_SIZE * 0.5;
            if (calcAngle < finalAngle || (finalAngle == 0 && calcAngle >= 180))
            {
                calcAngle += (randSign() >= 0) * 180;
                calcAngle = inRad(calcAngle);
                calcY += SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                calcX -= SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
            }
            else
            {
                calcAngle += (randSign() >= 0) * 180;
                calcAngle = inRad(calcAngle);
                calcY -= SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                calcX += SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
            }
            var radius = randNumb(0, SQUARE_SIZE / 2.25);
            calcX += Math.cos(calcAngle) * radius;
            calcY += Math.sin(calcAngle) * radius;
        }
        else if (motion == DOWN_CHAR)
        {
            calcX += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcY += SQUARE_SIZE + randNumb(-SQUARE_SIZE, 0);
        }
        else if (motion == UP_CHAR)
        {
            calcX += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcY += randNumb(0, SQUARE_SIZE);
        }
        else if (motion == RIGHT_CHAR)
        {
            calcY += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcX += SQUARE_SIZE + randNumb(-SQUARE_SIZE, 0);
        }
        else if (motion == LEFT_CHAR)
        {
            calcY += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcX += randNumb(0, SQUARE_SIZE);
        }
        g_dust[g_dust.length] = new DynamicParticle(g_dustImg, calcX, calcY, 0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, SQUARE_SIZE / 40, SQUARE_SIZE / 40);
    }
}

function enemyTactics(enemy, distance)
{
    if (distance < Math.floor(enemy.foundRadius / 4) * 3)
    {
        enemy.motion = NOTHING_CHAR;
        atack(enemy);
    }
    else
    {
        chase(enemy);
    }
}

function isPlayerFound(plaX, plaY, enX, enY)
{
    var y;
    var sign;
    if (plaX == enX)
    {
        sign = plaY > enY ? 1 : -1;
        for (y = enY; (y > plaY && sign < 0) || (y < plaY && sign > 0); y = y + sign)
        {
            if (g_gameField[y][enX] == BARRICADE_CHAR ||
                g_gameField[y][enX] == TRAVELED_BARRICADE_CHAR)
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
            if (g_gameField[y][Math.floor(x / SQUARE_SIZE)] == BARRICADE_CHAR ||
                g_gameField[y][Math.floor(x / SQUARE_SIZE)] == TRAVELED_BARRICADE_CHAR)
            {
                return 0;
            }
        }
        return 1;

    }
}

function randSign()
{
    if (Math.random() > 0.5)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}

function randNumb(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}