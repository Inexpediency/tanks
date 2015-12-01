/**
 * Created by Vasily on 14.09.2015.
 */
var g_ctx;
var g_canvas;
var g_gameField = [[]];
var g_currentLevel = 0;
var g_enemy;
var g_AllBangs;
var g_Smoke;
var g_Balls;
var g_player;

var g_traveledBarricage = new Image;
g_traveledBarricage.src = TRAVELED_BARRICADE_ADDRESS;
var g_barricage = new Image;
g_barricage.src = BARRICADE_ADDRESS;
var g_sparkImg = new Image();
g_sparkImg.src = SPARK_ADDRESS;
var g_smokeImg = new Image;
g_smokeImg.src = SMOKE_ADDRESS;

window.onload = function()
{
    g_currentLevel = parseInt(parseQueryString().level);
    if (isNaN(g_currentLevel) || g_currentLevel >= g_levels.length || g_currentLevel < 0)
    {
        window.location = START_SCREEN_ADDRESS;
    }
    initCanvas();
    init();
    initPauseButton();
};

function init()
{
    initGlobVar();
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
    g_Smoke = [];
}

function initField()
{
    g_gameField = copyMas(g_levels[g_currentLevel]);
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
    var pauseButton = document.getElementById("pauseButton");
    pauseButton.style.background = "url(\"" + PAUSE_BUTTON_ADDRESS + "\")";
    pauseButton.style.backgroundSize = "cover";
    pauseButton.isPause = 0;
    pauseButton.onmouseover = function()
    {
        if (this.isPause)
        {
            this.style.background = "url(\"" + PLAY_BUTTON_ADDRESS_HOVER + "\")";
        }
        else
        {
            this.style.background = "url(\"" + PAUSE_BUTTON_ADDRESS_HOVER + "\")";
        }
        this.style.backgroundSize = "cover";
    };
    pauseButton.onmouseout = function()
    {
        if (this.isPause)
        {
            this.style.background = "url(\"" + PLAY_BUTTON_ADDRESS + "\")";
        }
        else
        {
            this.style.background = "url(\"" + PAUSE_BUTTON_ADDRESS + "\")";
        }
        this.style.backgroundSize = "cover";
    };
    pauseButton.onmousedown = function()
    {
        if (this.isPause)
        {
            g_intervalId = setInterval(gameTick, DELAY);
            this.style.background = "url(\"" + PAUSE_BUTTON_ADDRESS_CLICK + "\")";
        }
        else
        {
            clearInterval(g_intervalId);
            this.style.background = "url(\"" + PLAY_BUTTON_ADDRESS_CLICK + "\")";
        }
        this.isPause = !this.isPause;
        this.style.backgroundSize = "cover";
    };
    pauseButton.onmouseup = function()
    {
        if (this.isPause)
        {
            this.style.background = "url(\"" + PLAY_BUTTON_ADDRESS_HOVER + "\")";
        }
        else
        {
            this.style.background = "url(\"" + PAUSE_BUTTON_ADDRESS_HOVER + "\")";
        }
        this.style.backgroundSize = "cover";
    };
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
                initHealthBlock();
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
    g_intervalId = setInterval(drawFirstShadow, DELAY);
}

function drawFirstShadow()
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
    g_intervalId = setInterval(drawLastBang, DELAY);
}

function drawField()
{
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
    g_contextCtx.clearRect(0, 0, g_context.width, g_context.height);
    drawGrid();
    drawCells();
    drawBangs();
    drawSmoke();
    drawPlayerHealth();
}

function drawCells()
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
                g_ctx.drawImage(g_traveledBarricage, -SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
                g_ctx.rotate(-angle);
                g_ctx.translate(-x * SQUARE_SIZE - 0.5 * SQUARE_SIZE, -y * SQUARE_SIZE - 0.5 * SQUARE_SIZE);
            }
            else if (g_gameField[y][x] == BARRICADE_CHAR)
            {
                g_ctx.translate(x * SQUARE_SIZE + 0.5 * SQUARE_SIZE, y * SQUARE_SIZE + 0.5 * SQUARE_SIZE);
                g_ctx.rotate(angle);
                g_ctx.drawImage(g_barricage, -SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
                g_ctx.rotate(-angle);
                g_ctx.translate(-x * SQUARE_SIZE - 0.5 * SQUARE_SIZE, -y * SQUARE_SIZE - 0.5 * SQUARE_SIZE);
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

function drawLastBang()
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
};