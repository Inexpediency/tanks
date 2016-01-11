/**
 * Created by Vasiliy on 1/11/2016.
 */
function Game(level)
{
    var game = this;
    this.field = new Field(level);
    this.paused = 0;
    this.isGameEnd = 0;

    this.tick = function()
    {
        if (game.isShadowVisible)
        {
            moveArrObj(game.field.bangs);
            game.field.draw();
            drawShadow(game.shadowStep);
            $("body").css("display", "block");
            if (g_shadow.level == 0 ||
                g_shadow.level == SHADOW_LEVEL)
            {
                g_shadowCanvas.style.width = "0";
                game.isShadowVisible = 0;
            }
        }
        else if (!game.paused)
        {
            game.field.move();
            game.field.draw();
        }
        var playerNumb = findTank(game.field.enemy, PLAYER_CHAR);
        if ((playerNumb == undefined ||
            game.field.enemy[playerNumb + 1]  == undefined &&
            game.field.enemy[playerNumb - 1]  == undefined) && g_shadow.level == 0)
        {
            g_shadowCanvas.style.width = "100%";
            game.isShadowVisible = 1;
            game.shadowStep = 1;
            game.isGameEnd = 1;
        }
        if (game.isGameEnd && !game.isShadowVisible)
        {
            clearInterval(game.intervalId);
            showResultScreen(game.field);
        }
    };
}