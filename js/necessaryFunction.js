/**
 * Created by Vasiliy on 10/4/2015.
 */

function copyMas(mas)
{
    var result = [];
    for (var i = 0; i < mas.length; ++i)
    {
        result[i] = mas[i].slice();
    }
    return result;
}

function isTankCell(x, y)
{
    if (g_gameField[y][x] == ARMOR_ENEMY_CHAR ||
        g_gameField[y][x] == SPRINT_ENEMY_CHAR ||
        g_gameField[y][x] == ENEMY_CHAR)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function currentChar(angle, towerState)
{
    if (angle == 0 && towerState == "r"||
        angle == 90 && towerState == "u"||
        angle == 180 && towerState == "l"||
        angle == 270 && towerState == "d")
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function isDegCel(angle)
{
    if (angle == 0 ||
        angle == 90 ||
        angle == 180||
        angle == 270 ||
        angle == 360)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

function charInDeg(char)
{
    if (char == "u")
    {
        return 90;
    }
    else if (char == "l")
    {
        return 180;
    }
    else if (char == "d")
    {
        return 270;
    }
    else if (char == "r")
    {
        return 0;
    }

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

function culcBodyAngle(startAngle, finalAngle, step)
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

function culcAngel(startAngle, finalAngle, currentStep)
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
    for (var i = 0; i < g_AllBangs.length; i++)
    {
        if (g_AllBangs[i].move())
        {
            g_AllBangs.splice(i, 1);
        }
    }
}

function drawBangs()
{
    for (var i = 0; i < g_AllBangs.length; i++)
    {
        g_AllBangs[i].draw();
    }
}

function moveBalls()
{
    for (var i = 0; i < g_Balls.length; i++)
    {
        if (g_Balls[i].move())
        {
            g_Balls.splice(i, 1);
        }
    }
}

function culcHealth(x, y)
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
    else if (isTankCell(x, y))
    {
        var woundedEnemy = find(x, y, g_enemy);
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

function drawFillArc(x, y, radius, color)
{
    g_ctx.strokeStyle = color;
    g_ctx.beginPath();
    for (var x1 = 0; x1 <= radius * 2; x1 += 0.01)
    {
        g_ctx.moveTo(x, y);
        g_ctx.lineTo(x - radius + x1, y + (Math.sqrt(Math.abs(radius * radius - (x1 - radius) * (x1 - radius)))));
        g_ctx.moveTo(x, y);
        g_ctx.lineTo(x - radius + x1, y  - (Math.sqrt(Math.abs(radius * radius - (x1 - radius) * (x1 - radius)))));
    }

    g_ctx.stroke();
}

function showResultScreen()
{
    var message;
    var button;
    g_ctx.font = HEADER_RESULT_FONT;
    g_ctx.fillStyle = HEADER_RESULT_COLOR;
    var isVin = g_player.health > 0;
    if (isVin)
    {
        message = VIN_MESSAGE;
        button = g_endLevelText;
    }
    else
    {
        message = lOSE_MESSAGE;
        button = g_endLevelText;
    }
    var halfBackgroundX = Math.floor(g_endLevelBlank.width / 2);
    var halfBackgroundY = Math.floor(g_endLevelBlank.height / 2);
    var halfCanvasX = Math.floor(g_canvas.width / 2);
    var halfCanvasY = Math.floor(g_canvas.height / 2);
    var buttonX = halfCanvasX - Math.floor(g_endLevelText.width / 2);
    var buttonY = halfCanvasY - Math.floor(g_endLevelText.height / 2);
    var messageX = halfCanvasX - (g_ctx.measureText(message).width) / 2;
    var messageY = halfCanvasY - halfBackgroundY + HEADER_RESULT_PADDING_TOP;
    g_ctx.drawImage(g_endLevelBlank, halfCanvasX - halfBackgroundX, halfCanvasY - halfBackgroundY);
    g_ctx.fillText(message, messageX, messageY);
    g_ctx.drawImage(button, buttonX, buttonY);
    g_canvas.onmousemove = function(event)
    {
        if (event.clientX <= buttonX + g_endLevelText.width &&
            event.clientX >= buttonX &&
            event.clientY <= buttonY + g_endLevelText.height &&
            event.clientY >= buttonY)
        {
            button.src = END_LEVEL_TEXT_ADDRESS_HOVER;
        }
        else
        {
            button.src = END_LEVEL_TEXT_ADDRESS;
        }
        button.onload = function()
        {
            console.log(messageX, messageY);
            g_ctx.drawImage(g_endLevelBlank, halfCanvasX - halfBackgroundX, halfCanvasY - halfBackgroundY);
            g_ctx.fillText(message, messageX, messageY);
            g_ctx.drawImage(button, buttonX, buttonY);
            g_endLevelBlank.onload = undefined;
        };
    };
    g_canvas.onclick = function(event)
    {
        if (event.clientX < buttonX+ g_endLevelText.width &&
            event.clientX > buttonX &&
            event.clientY < buttonY + g_endLevelText.height &&
            event.clientY > buttonY)
        {
            g_canvas.onclick = undefined;
            g_canvas.onmousemove = undefined;
            if (g_currentLevel + 1 != g_levels.length && isVin)
            {
                g_currentLevel++;
                init();
            }
            else
            {
                showStartScreen();
            }
        }
    };
}

function showStartScreen()
{
    g_canvas.height = g_startBackground.height;
    g_canvas.width = g_startBackground.width;
    g_ctx.drawImage(g_startBackground, 0, 0);
    g_ctx.drawImage(g_playText, PLAY_TEXT_X, PLAY_TEXT_Y);
    g_canvas.onmousemove = function(event)
    {
        if (event.clientX <= PLAY_TEXT_X + g_playText.width &&
            event.clientX >= PLAY_TEXT_X &&
            event.clientY <= PLAY_TEXT_Y + g_playText.height &&
            event.clientY >= PLAY_TEXT_Y)
        {
            g_playText.src = PLAY_TEXT_ADDRESS_HOVER;
        }
        else
        {
            g_playText.src = PLAY_TEXT_ADDRESS;
        }
        g_playText.onload = function()
        {
            g_ctx.drawImage(g_startBackground, 0, 0, g_canvas.width, g_canvas.height);
            g_ctx.drawImage(g_playText, PLAY_TEXT_X, PLAY_TEXT_Y);
            g_playText.onload = undefined;
        };
    };
    g_canvas.onclick = function(event)
    {
        if (event.clientX < PLAY_TEXT_X + g_playText.width &&
            event.clientX > PLAY_TEXT_X &&
            event.clientY < PLAY_TEXT_Y + g_playText.height &&
            event.clientY > PLAY_TEXT_Y)
        {
            g_canvas.onmousemove = undefined;
            g_canvas.onclick = undefined;
            init();
        }
    };
}

function drawShadow()
{
    if (g_shadow.level <= SHADOW_LEVEL)
    {
        g_shadow.level++;
    }
    for (var i = 0; i < g_shadow.level; ++i)
    {
        g_ctx.drawImage(g_shadow, 0, 0, g_canvas.width, g_canvas.height);
    }
}

function drawGrid()
{
    //var background = new Image();
    //background.src = BACKGROUND_ADDRESS;
    //g_ctx.drawImage(background, 0, 0, g_canvas.width, g_canvas.height);
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

function find(x, y, mas)
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
    if (enemy.motion == NOTHING_CHAR && isDegCel(enemy.bodyAngle))
    {
        var direction = randNumbFrom(0, 4);
        if (direction == 0)
        {
            enemy.motion = "r";
            enemy.routeBefor = "r";
            enemy.towerState = "r";
        }
        else if (direction == 1)
        {
            enemy.motion = "l";
            enemy.routeBefor = "l";
            enemy.towerState = "l";
        }
        else if (direction == 2)
        {
            enemy.motion = "d";
            enemy.routeBefor = "d";
            enemy.towerState = "d";
        }
        else if (direction == 3)
        {
            enemy.motion = "u";
            enemy.routeBefor = "u";
            enemy.towerState = "u";
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
            enemy.towerState = "d";
        }
        else
        {
            if (checkYFireWay(enemy.x, enemy.y, 0) == PLAYER_CHAR)
            {
                enemy.fire = true;
            }
            enemy.towerState = "u";
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
            enemy.towerState = "l";
        }
        else
        {
            if (checkXFireWay(enemy.x, enemy.y, g_gameField[enemy.y].length) == PLAYER_CHAR)
            {
                enemy.fire = true;}
            enemy.towerState = "r";
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
                enemy.motion = "d";
            }
            else

            {
                enemy.motion = "u";
            }
        }
        else
        {
            if (enemy.x > g_player.x)
            {
                enemy.motion = "l";
            }
            else
            {
                enemy.motion = "r";
            }
        }
    }
}

function chase(enemy)
{
    if (enemy.x == g_player.x && g_player.y < enemy.y)
    {
        enemy.motion = "u";
    }
    else if (enemy.x == g_player.x && g_player.y > enemy.y)
    {
        enemy.motion = "d";
    }
    else if (enemy.x < g_player.x && g_player.y == enemy.y)
    {
        enemy.motion = "r";
    }
    else if (enemy.x < g_player.x && g_player.y < enemy.y)
    {
        if (enemy.motion == "u")
        {
            enemy.motion = "r";
        }
        else
        {
            enemy.motion = "u";
        }
    }
    else if (enemy.x < g_player.x && g_player.y > enemy.y)
    {
        if (enemy.motion == "d")
        {
            enemy.motion = "r";
        }
        else
        {
            enemy.motion = "d";
        }
    }
    else if (enemy.x > g_player.x && g_player.y == enemy.y)
    {
        enemy.motion = "l";
    }
    else if (enemy.x > g_player.x && g_player.y < enemy.y)
    {
        if (enemy.motion == "u")
        {
            enemy.motion = "l";
        }
        else
        {
            enemy.motion = "u";
        }
    }
    else if (enemy.x > g_player.x && g_player.y > enemy.y)
    {
        if (enemy.motion == "d")
        {
            enemy.motion = "l";
        }
        else
        {
            enemy.motion = "d";
        }
    }
}

function enemyTaktik(enemy, distance)
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
                return 0; //�� ���������
            }
        }
        return 1; //���������

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

function randNumbFrom(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}