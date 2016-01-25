/***Created by Vasily on 14.09.2015.***/

$(window).ready(function()
{
    var currentLevel = parseQueryString().level;
    if (isNaN(currentLevel) || currentLevel >= g_levels.length || currentLevel < 0)
    {
        window.location = START_SCREEN_ADDRESS;
    }
    var canvas = document.getElementById("gameField");
    var game = new Game(currentLevel);
    canvas.height = (game.field.gameField.length) * SQUARE_SIZE;
    canvas.width = (game.field.gameField[0].length) * SQUARE_SIZE;
    canvas.style.marginLeft = -parseInt(canvas.width / 2) + "px";
});