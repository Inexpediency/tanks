/**
 * Created by Vasily on 14.09.2015.
 */
var g_ctx;
var g_canvas;
var g_intervalId;
var g_gameField = [[]];
var g_currentLevel = 0;
var g_enemy = [];
var g_AllBangs = [];
var g_Balls = [];
var g_player;

var g_sparkImg = new Image();
g_sparkImg.src = SPARK_ADDRESS;
var g_startBackground = new Image();
g_startBackground.src = START_SCREEN_ADDRESS;
var g_playText = new Image();
g_playText.src = PLAY_TEXT_ADDRESS;

window.onload = function()
{
    initCanvas();
    showStartScreen();
};

function init()
{
    initGlobVar();
    console.log(g_AllBangs);
    initField();
    initPlayers();
    startGame();
}

function initGlobVar()
{
    g_player = {};
    g_enemy = [];
    g_Balls = [];
    g_AllBangs = [];
}

function initField()
{
    g_gameField = copyMas(g_levels[g_currentLevel]);
    g_canvas.height = (g_gameField.length) * SQUARE_SIZE;
    g_canvas.width = (g_gameField[0].length) * SQUARE_SIZE;
}

function initCanvas()
{
    g_canvas = document.getElementById("gameField");
    g_ctx = g_canvas.getContext("2d");
}

function initPlayers()
{
    var lastEl;
    for (var y = 0; y < g_gameField.length; y++)
    {
        for (var x = 0; x < g_gameField[y].length; x++)
        {
            if (g_gameField[y][x] == PLAYER_CHAR)
            {
                g_player = new Player(x, y, "u", PLAYER_CHAR, PLAYER_CONSTS);
                g_player.initDefault();
            }
            else if (g_gameField[y][x] == ENEMY_CHAR)
            {
                lastEl = g_enemy.length;
                g_enemy[lastEl] = new Player(x, y, "u", ENEMY_CHAR, ENEMY_CONSTS);
                g_enemy[lastEl].initDefault();
            }
            else if (g_gameField[y][x] == SPRINT_ENEMY_CHAR)
            {
                lastEl = g_enemy.length;
                g_enemy[lastEl] = new Player(x, y, "u", SPRINT_ENEMY_CHAR, SPRINT_ENEMY_CONSTS);
                g_enemy[lastEl].initDefault();
            }
            else if (g_gameField[y][x] == ARMOR_ENEMY_CHAR)
            {
                lastEl = g_enemy.length;
                g_enemy[lastEl] = new Player(x, y, "u", ARMOR_ENEMY_CHAR, ARMOR_ENEMY_CONSTS);
                g_enemy[lastEl].initDefault();
            }
        }
    }
}

function startGame()
{
    g_intervalId = setInterval(gameTick, DELAY);
}

function gameTick()
{
    drawField();
    moveBangs();
    moveEnemy();
    moveBalls();
    g_player.move();
    if (g_enemy.length == 0)
    {
        if (g_currentLevel + 1 != g_levels.length)
        {
            endLevel();
        }
        else
        {
            gameOver();
        }
    }
}

function gameOver()
{
    clearInterval(g_intervalId);
    showStartScreen();
}

function endLevel()
{
    clearTimeout(g_intervalId);
    g_currentLevel++;
    init();
}

function drawField()
{
    g_ctx.fillStyle = "#ffffff";
    g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);
    drawGrid();
    drawCells();
    drawBangs();
}

function drawCells()
{
    for (var y = 0; y < g_gameField.length; ++y)
    {
        for (var x = 0; x < g_gameField[y].length; ++x)
        {
            if (g_gameField[y][x] == TRAVELED_BARRICADE_CHAR)
            {
                g_ctx.fillStyle = "#666666";
                g_ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
            else if (g_gameField[y][x] == BARRICADE_CHAR)
            {
                g_ctx.fillStyle = "#000000";
                g_ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
            else if (g_gameField[y][x] == BALL_CHAR)
            {
                drawFillArc((x + 0.5) * SQUARE_SIZE, (y + 0.5) * SQUARE_SIZE, SQUARE_SIZE / 10, "#808080");
            }
            else if (isTankCell(x, y))
            {
                g_enemy[find(x, y, g_enemy)].draw();
            }
            else if (g_gameField[y][x] == PLAYER_CHAR)
            {
                g_player.draw();
            }
        }
    }
}

window.onkeydown = function(event)
{
    switch (event.which)
    {
        case TOWER_UP:
            g_player.towerState =  "u"; //up
            break;
        case TOWER_DOWN:
            g_player.towerState =  "d"; //down
            break;
        case TOWER_LEFT:
            g_player.towerState =  "l"; //left
            break;
        case TOWER_RIGHT:
            g_player.towerState = "r"; //right
            break;
        case FIRE:
            g_player.fire = true;
            break;
        case UP:
            g_player.motion = "u";
            g_player.routeBefor = "u";
            break;
        case DOWN:
            g_player.motion = "d";
            g_player.routeBefor = "d";
            break;
        case LEFT:
            g_player.motion = "l";
            g_player.routeBefor = "l";
            break;
        case RIGHT:
            g_player.motion = "r";
            g_player.routeBefor = "r";
            break;
    }
};

window.onkeyup = function(event)
{
    switch (event.which)
    {
        case DOWN:
            if (g_player.motion == "d")
            {
                g_player.motion = NOTHING_CHAR;
            }
            break;
        case LEFT:
            if (g_player.motion == "l")
            {
                g_player.motion = NOTHING_CHAR;
            }
            break;
        case UP:
            if (g_player.motion == "u")
            {
                g_player.motion = NOTHING_CHAR;
            }
            break;
        case RIGHT:
            if (g_player.motion == "r")
            {
                g_player.motion = NOTHING_CHAR;
            }
            break;
    }
}