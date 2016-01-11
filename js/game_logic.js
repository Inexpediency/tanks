/***Created by Vasily on 14.09.2015.***/
var g_ctx;
var g_canvas;

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

function initField(field)
{
    g_canvas.height = (field.gameField.length) * SQUARE_SIZE;
    g_canvas.width = (field.gameField[0].length) * SQUARE_SIZE;
    g_canvas.style.marginLeft = -parseInt(g_canvas.width / 2) + "px";
}

function initCanvas()
{
    g_canvas = document.getElementById("gameField");
    g_ctx = g_canvas.getContext("2d");
    initContext();
}

$(window).ready(function()
{
    var currentLevel = parseQueryString().level;
    if (isNaN(currentLevel) || currentLevel >= g_levels.length || currentLevel < 0)
    {
        window.location = START_SCREEN_ADDRESS;
    }
    var game = new Game(currentLevel);
    game.isShadowVisible = 1;
    game.shadowStep = -1;
    initCanvas();
    initField(game.field);
    initHealthBlock();
    initKeys(game.field.player);
    initPauseButton(game);
    game.intervalId = setInterval(game.tick, DELAY);
});