/**
 * Created by Vasiliy on 1/6/2016.
 */
function Field(currentLevel)
{
    this.currentLevel = currentLevel;
    this.gameField = copyArray(g_levels[currentLevel]);//потом надо сделать через сервер и AJAX
    this.enemy = initPlayers(this);
    this.balls = [];
    this.bangs = [];
    this.player = this.enemy[findTank(this.enemy, PLAYER_CHAR)];

    this.move = function()
    {
        moveArrObj(this.balls);
        moveArrObj(this.bangs);
        moveArrObj(this.enemy);
    };
    this.draw = function()
    {
        g_shadowCtx.clearRect(0, 0, g_shadowCanvas.width, g_shadowCanvas.height);
        g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
        drawGrid(this);
        drawObjects(this);
        drawArrObj(this.bangs);
        drawPlayerHealth(this.player);
    };
}