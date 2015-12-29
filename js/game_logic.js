/**
 * Created by Vasily on 14.09.2015.
 */
var g_ctx;
var g_canvas;
var g_gameField = [[]];
var g_currentLevel = 0;
var g_enemy = [];
var g_bangs = [];
var g_smoke = [];
var g_dust = [];
var g_balls = [];
var g_player = {};

var g_traveledBarricade = new Image();
g_traveledBarricade.src = TRAVELED_BARRICADE_ADDRESS;
var g_barricade = new Image();
g_barricade.src = BARRICADE_ADDRESS;
var g_sparkImg = new Image();
g_sparkImg.src = SPARK_ADDRESS;
var g_smokeImg = new Image();
g_smokeImg.src = SMOKE_ADDRESS;
var g_dustImg = new Image();
g_dustImg.src = DUST_ADDRESS;
var g_ballImg = new Image();
g_ballImg.src = BALL_ADDRESS;

function init()
{
    initField();
    initPlayers();
    startGame();
}

function initField()
{
    g_gameField = copyArray(g_levels[g_currentLevel]);
    g_canvas.height = (g_gameField.length) * SQUARE_SIZE;
    g_canvas.width = (g_gameField[0].length) * SQUARE_SIZE;
    g_canvas.style.marginLeft = -parseInt(g_canvas.width / 2) + "px";
}

function initCanvas()
{
    g_canvas = document.getElementById("gameField");
    g_ctx = g_canvas.getContext("2d");
    initContext();
}

function initPauseButton()
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
            g_intervalId = setInterval(gameTick, DELAY);
            pauseButton.css("background", "url(\"" + PAUSE_BUTTON_ADDRESS_CLICK + "\")");
        }
        else
        {
            clearInterval(g_intervalId);
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

function initPlayers()
{
    for (var y = 0; y < g_gameField.length; y++)
    {
        for (var x = 0; x < g_gameField[y].length; x++)
        {
            var currentCell = g_gameField[y][x];
            if (currentCell == PLAYER_CHAR)
            {
                initHealthBlock();
                g_player = new Player(x, y, PLAYER_CHAR, PLAYER_CONSTS);
                g_player.initDefault();
            }
            else if (currentCell == ENEMY_CHAR)
            {
                createEnemy(x, y, ENEMY_CHAR, ENEMY_CONSTS);
            }
            else if (currentCell == SPRINT_ENEMY_CHAR)
            {
                createEnemy(x, y, SPRINT_ENEMY_CHAR, SPRINT_ENEMY_CONSTS);
            }
            else if (currentCell == ARMOR_ENEMY_CHAR)
            {
                createEnemy(x, y, ARMOR_ENEMY_CHAR, ARMOR_ENEMY_CONSTS);
            }
        }
    }
}

function createEnemy(x, y, char, consts)
{
    var currentElement = g_enemy.length;
    g_enemy[currentElement] = new Player(x, y, char, consts);
    g_enemy[currentElement].initDefault();

}

function startGame()
{
    g_intervalId = setInterval(drawFogging, DELAY);
}

function drawFogging()
{
    drawField();
    drawShadow(0, -1);
    document.body.style.display = "block";
    if (g_shadow.level <= 0)
    {
        clearInterval(g_intervalId);
        g_context.style.width = "0";
        g_intervalId = setInterval(gameTick, DELAY);
    }
}

function gameTick()
{
    drawField();
    moveBangs();
    moveEnemy();
    moveBalls();
    g_player.move();
    if (g_enemy.length == 0 || g_player.health <= 0)
    {
        endGame();
    }
}

function endGame()
{
    clearInterval(g_intervalId);
    g_context.style.width = "100%";
    g_intervalId = setInterval(drawRemainingBang, DELAY);
}

function drawField()
{
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    g_contextCtx.clearRect(0, 0, g_context.width, g_context.height);
    drawStaticParticle(g_dust);
    drawGrid();
    drawObjects();
    drawBangs();
    drawStaticParticle(g_smoke);
    drawPlayerHealth();
}

function drawObjects()
{
    var angle = 0;
    for (var y = 0; y < g_gameField.length; ++y)
    {
        for (var x = 0; x < g_gameField[y].length; ++x)
        {
            angle +=  Math.PI / 6;
            if (g_gameField[y][x] == TRAVELED_BARRICADE_CHAR)
            {
                g_ctx.translate(x * SQUARE_SIZE + 0.5 * SQUARE_SIZE, y * SQUARE_SIZE + 0.5 * SQUARE_SIZE);
                g_ctx.rotate(angle);
                g_ctx.drawImage(g_traveledBarricade, -SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
                g_ctx.rotate(-angle);
                g_ctx.translate(-x * SQUARE_SIZE - 0.5 * SQUARE_SIZE, -y * SQUARE_SIZE - 0.5 * SQUARE_SIZE);
            }
            else if (g_gameField[y][x] == BARRICADE_CHAR)
            {
                g_ctx.translate(x * SQUARE_SIZE + 0.5 * SQUARE_SIZE, y * SQUARE_SIZE + 0.5 * SQUARE_SIZE);
                g_ctx.rotate(angle);
                g_ctx.drawImage(g_barricade, -SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
                g_ctx.rotate(-angle);
                g_ctx.translate(-x * SQUARE_SIZE - 0.5 * SQUARE_SIZE, -y * SQUARE_SIZE - 0.5 * SQUARE_SIZE);
            }
            else if (g_gameField[y][x] == BALL_CHAR)
            {
                g_balls[findElement(x, y, g_balls)].draw();
            }
            else if (isTankAtCell(x, y))
            {
                g_enemy[findElement(x, y, g_enemy)].draw();
            }
            else if (g_gameField[y][x] == PLAYER_CHAR)
            {
                g_player.draw();
            }
        }
    }
}

function drawRemainingBang()
{
    moveBangs();
    moveBalls();
    drawField();
    drawShadow(SHADOW_LEVEL, 1);
    if (g_shadow.level >= SHADOW_LEVEL)
    {
        clearInterval(g_intervalId);
        showResultScreen();
    }
}

function showResultScreen()
{
    var isWin = +(g_player.health > 0);
    window.location = RESULT_SCREEN_ADDRESS + "?isWin=" + isWin + "&currentLevel=" + g_currentLevel + "&";
}

$(window).ready(function()
{
    g_currentLevel = parseInt(parseQueryString().level);
    if (isNaN(g_currentLevel) || g_currentLevel >= g_levels.length || g_currentLevel < 0)
    {
        window.location = START_SCREEN_ADDRESS;
    }
    initCanvas();
    init();
    initPauseButton();
});

$(window).keydown(function(event)
{
    switch (event.which)
    {
        case TOWER_UP:
            g_player.towerState =  UP_CHAR; //up
            break;
        case TOWER_DOWN:
            g_player.towerState =  DOWN_CHAR; //down
            break;
        case TOWER_LEFT:
            g_player.towerState =  LEFT_CHAR; //left
            break;
        case TOWER_RIGHT:
            g_player.towerState = RIGHT_CHAR; //right
            break;
        case FIRE:
            g_player.fire = true;
            break;
        case UP:
            g_player.motion = UP_CHAR;
            g_player.finalBodeState = UP_CHAR;
            break;
        case DOWN:
            g_player.motion = DOWN_CHAR;
            g_player.finalBodeState = DOWN_CHAR;
            break;
        case LEFT:
            g_player.motion = LEFT_CHAR;
            g_player.finalBodeState = LEFT_CHAR;
            break;
        case RIGHT:
            g_player.motion = RIGHT_CHAR;
            g_player.finalBodeState = RIGHT_CHAR;
            break;
    }
});

$(window).keyup(function(event)
{
    var key = event.which;
    if (key == DOWN && g_player.motion == DOWN_CHAR)
    {
        g_player.motion = NOTHING_CHAR;
    }
    else if (key == LEFT && g_player.motion == LEFT_CHAR)
    {
        g_player.motion = NOTHING_CHAR;
    }
    else if (key == UP && g_player.motion == UP_CHAR)
    {
        g_player.motion = NOTHING_CHAR;
    }
    else if (key == RIGHT && g_player.motion == RIGHT_CHAR)
    {
        g_player.motion = NOTHING_CHAR;
    }
});