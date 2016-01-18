/***Created by Vasily on 14.09.2015.***/

$(window).ready(function()
{
    var currentLevel = parseQueryString().level;
    if (isNaN(currentLevel) || currentLevel >= g_levels.length || currentLevel < 0)
    {
        window.location = START_SCREEN_ADDRESS;
    }
    var game = new Game(currentLevel);
    var canvas = document.getElementById("gameField");
    canvas.height = (game.field.gameField.length) * SQUARE_SIZE;
    canvas.width = (game.field.gameField[0].length) * SQUARE_SIZE;
    canvas.style.marginLeft = -parseInt(g_canvas.width / 2) + "px";
    game.initHealthBlock();
    game.initKeys(game.field.player);
    game.initPauseButton();
    game.intervalId = setInterval(game.tick, DELAY);
});