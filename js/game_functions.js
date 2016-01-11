/**
 * Created by Vasiliy on 10/4/2015.
 */

function initPlayers(field)
{
    var enemyArr = [];
    for (var y = 0; y < field.gameField.length; y++)
    {
        for (var x = 0; x < field.gameField[y].length; x++)
        {
            var currentCell = field.gameField[y][x];
            if (currentCell == PLAYER_CHAR)
            {
                initHealthBlock();
                var lastNumb = enemyArr.length;
                enemyArr[lastNumb] = new Tank(x, y, PLAYER_CHAR, PLAYER_CONSTS, field);
                enemyArr[lastNumb].initDefault();
            }
            else if (currentCell == ENEMY_CHAR)
            {
                enemyArr[enemyArr.length] = createEnemy(x, y, ENEMY_CHAR, ENEMY_CONSTS, field);
            }
            else if (currentCell == SPRINT_ENEMY_CHAR)
            {
                enemyArr[enemyArr.length] = createEnemy(x, y, SPRINT_ENEMY_CHAR, SPRINT_ENEMY_CONSTS, field);
            }
            else if (currentCell == ARMOR_ENEMY_CHAR)
            {
                enemyArr[enemyArr.length] = createEnemy(x, y, ARMOR_ENEMY_CHAR, ARMOR_ENEMY_CONSTS, field);
            }
        }
    }
    return enemyArr;
}

function createEnemy(x, y, char, consts, field)
{
    var enemy;
    enemy = new Tank(x, y, char, consts, field);
    enemy.initDefault();
    return enemy;
}

function drawRotatedObj(angle, img, x, y, w, h, isTower)
{
    g_ctx.translate(x, y);
    g_ctx.rotate(inRad(angle));
    if (isTower)
    {
        g_ctx.drawImage(img, -w / 5, -h / 2, w, h);
    }
    else
    {
        g_ctx.drawImage(img, -w / 2, -h / 2, w, h);
    }
    g_ctx.rotate(-inRad(angle));
    g_ctx.translate(-x, -y);
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

function drawPlayerHealth(player)
{
    var healthBlock = $("#health");
    healthBlock.html("");
    if (player.health > MAX_VISIBLE_HEALTH)
    {
        var health = new Image();
        health.src = HEALTH_ADDRES;
        healthBlock.append(health, " x" + player.health);
    }
    else
    {
        for (var i = 0; i < player.health; ++i)
        {
            var health = new Image();
            health.src = HEALTH_ADDRES;
            healthBlock.append(health);
        }
    }
}

function calcFireDirection(player, field)
{
    if (player.towerState == UP_CHAR)
    {
        field.balls[field.balls.length] = new Ball(player.x, player.y - 1, player.towerState, field);
    }
    else if (player.towerState == DOWN_CHAR)
    {
        field.balls[field.balls.length] = new Ball(player.x, player.y + 1, player.towerState, field);
    }
    else if (player.towerState == RIGHT_CHAR)
    {
        field.balls[field.balls.length] = new Ball(player.x + 1, player.y, player.towerState, field);
    }
    else if (player.towerState == LEFT_CHAR)
    {
        field.balls[field.balls.length] = new Ball(player.x - 1, player.y, player.towerState, field);
    }
}

function moveTank(tank, field)
{
    field.gameField[tank.y][tank.x] = NOTHING_CHAR;
    if (isCharSame(getCurrentChar(tank.bodyAngle), tank.motion) && tank.motionBefore == NOTHING_CHAR)
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
    if (field.gameField[tank.y][tank.x] != NOTHING_CHAR && tank.isTankReturn)
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
    field.gameField[tank.y][tank.x] = tank.character;
}

function drawGrid(field)
{
    g_ctx.strokeStyle = GRID_COLOR;
    g_ctx.beginPath();
    for (var i = 0; i < field.gameField[0].length; ++i)
    {
        g_ctx.moveTo(i * SQUARE_SIZE, 0);
        g_ctx.lineTo(i * SQUARE_SIZE, g_canvas.height);
    }
    for (var i = 0; i < field.gameField.length; ++i)
    {
        g_ctx.moveTo(0, i * SQUARE_SIZE);
        g_ctx.lineTo(g_canvas.width, i * SQUARE_SIZE);
    }
    g_ctx.stroke();
}

function calcMoving(enemy, field)
{
    patrol(enemy);
    var player = field.player;
    if (isPlayerFound(player.x, player.y, enemy.x, enemy.y, field))
    {
        fire(enemy, player);
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

function fire(enemy, player)
{
    if (enemy.x == player.x)
    {
        enemy.fire = 1;
        if (enemy.y > player.y)
        {
            enemy.towerState = DOWN_CHAR;
        }
        else
        {
            enemy.towerState = UP_CHAR;
        }
    }
    else
    {
        enemy.fire = 1;
        if (enemy.x > player.x)
        {
            enemy.towerState = LEFT_CHAR;
        }
        else
        {
            enemy.towerState = RIGHT_CHAR;
        }
    }
}

function isPlayerFound(plaX, plaY, enX, enY, field)
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
}

function showResultScreen(field)
{
    var isWin = +(field.player.health > 0);
    window.location = RESULT_SCREEN_ADDRESS + "?isWin=" + isWin + "&currentLevel=" + field.currentLevel + "&";
}

function initPauseButton(game)
{
    var pauseButton = $("#pauseButton");
    pauseButton.css("background", "url(\"" + PAUSE_BUTTON_ADDRESS + "\")");
    pauseButton.css("backgroundSize", "cover");
    pauseButton.isPause = 0;
    pauseButton.mouseover(function()
    {
        changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS_HOVER, PAUSE_BUTTON_ADDRESS_HOVER);
    });
    pauseButton.mouseout(function()
    {
        changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS, PAUSE_BUTTON_ADDRESS);
    });
    pauseButton.mousedown(function()
    {
        if (pauseButton.isPause)
        {
            game.paused = 0;
            pauseButton.css("background", "url(\"" + PAUSE_BUTTON_ADDRESS_CLICK + "\")");
        }
        else
        {
            game.paused = 1;
            pauseButton.css("background", "url(\"" + PLAY_BUTTON_ADDRESS_CLICK + "\")");
        }
        pauseButton.isPause = !pauseButton.isPause;
        pauseButton.css("backgroundSize", "cover");
    });
    pauseButton.mouseup(function()
    {
        changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS_HOVER, PAUSE_BUTTON_ADDRESS_HOVER);
    });
}

function changeButtonState(button, startAddress, finishAddress)
{
    if (button.isPause)
    {
        button.css("background", "url(\"" + startAddress + "\")");
    }
    else
    {
        button.css("background", "url(\"" + finishAddress + "\")");
    }
    button.css("backgroundSize", "cover");
}

function initKeys(player)
{
    $(window).keydown(function(event)
    {
        switch (event.which)
        {
            case TOWER_UP:
                player.towerState =  UP_CHAR; //up
                break;
            case TOWER_DOWN:
                player.towerState =  DOWN_CHAR; //down
                break;
            case TOWER_LEFT:
                player.towerState =  LEFT_CHAR; //left
                break;
            case TOWER_RIGHT:
                player.towerState = RIGHT_CHAR; //right
                break;
            case FIRE:
                player.fire = true;
                break;
            case UP:
                player.motion = UP_CHAR;
                player.finalBodeState = UP_CHAR;
                break;
            case DOWN:
                player.motion = DOWN_CHAR;
                player.finalBodeState = DOWN_CHAR;
                break;
            case LEFT:
                player.motion = LEFT_CHAR;
                player.finalBodeState = LEFT_CHAR;
                break;
            case RIGHT:
                player.motion = RIGHT_CHAR;
                player.finalBodeState = RIGHT_CHAR;
                break;
        }
    });

    $(window).keyup(function(event)
    {
        var key = event.which;
        if (key == DOWN && player.motion == DOWN_CHAR)
        {
            player.motion = NOTHING_CHAR;
        }
        else if (key == LEFT && player.motion == LEFT_CHAR)
        {
            player.motion = NOTHING_CHAR;
        }
        else if (key == UP && player.motion == UP_CHAR)
        {
            player.motion = NOTHING_CHAR;
        }
        else if (key == RIGHT && player.motion == RIGHT_CHAR)
        {
            player.motion = NOTHING_CHAR;
        }
    });
}