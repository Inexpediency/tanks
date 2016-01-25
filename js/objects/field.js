/**
 * Created by Vasiliy on 1/6/2016.
 */
function Field(currentLevel)
{
    var commonFunctionObj = new CommonFunctionObj();
    var canvas = document.getElementById("gameField");
    var ctx = canvas.getContext("2d");

    this.currentLevel = currentLevel;
    this.gameField = commonFunctionObj.copyArray(g_levels[currentLevel]);//потом надо сделать через сервер и AJAX
    this.players = [];
    this.balls = [];
    this.bangs = [];
    this.bonus = [];
    this.traveledBarricadeImg = new Image();
    this.traveledBarricadeImg.src = TRAVELED_BARRICADE_ADDRESS;
    this.barricadeImg = new Image();
    this.barricadeImg.src = BARRICADE_ADDRESS;

    this.move = function()
    {
        commonFunctionObj.moveArrObj(this.balls);
        commonFunctionObj.moveArrObj(this.bangs);
        commonFunctionObj.moveArrObj(this.players);
        commonFunctionObj.moveArrObj(this.bonus);
    };

    this.draw = function()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this._drawGrid();
        this._drawObjects();
        commonFunctionObj.drawArrObj(this.bangs);
        this._drawPlayerHealth();
    };

    this._drawObjects = function()
    {
        var angle = 0;
        var currentEl;
        for (var y = 0; y < this.gameField.length; ++y)
        {
            for (var x = 0; x < this.gameField[y].length; ++x)
            {
                currentEl = this.gameField[y][x];
                angle +=  30;
                if (currentEl == TRAVELED_BARRICADE_CHAR)
                {
                    commonFunctionObj.drawRotatedObj(angle, this.traveledBarricadeImg, x * SQUARE_SIZE + 0.5 * SQUARE_SIZE,
                                                   y * SQUARE_SIZE + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
                }
                else if (currentEl == BARRICADE_CHAR)
                {

                    commonFunctionObj.drawRotatedObj(angle, this.barricadeImg, x * SQUARE_SIZE + 0.5 * SQUARE_SIZE,
                                                   y * SQUARE_SIZE + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
                }
                else if (currentEl == BALL_CHAR)
                {
                    this.balls[commonFunctionObj.findElement(x, y, this.balls)].draw();
                }
                else if (currentEl == BONUS_CHAR)
                {
                    this.bonus[commonFunctionObj.findElement(x, y, this.bonus)].draw();
                }
                else if (currentEl != NOTHING_CHAR)
                {
                    this.players[commonFunctionObj.findElement(x, y, this.players)].draw();
                }
            }
        }
    };

    this._initPlayers = function()
    {
        for (var y = 0; y < this.gameField.length; y++)
        {
            for (var x = 0; x < this.gameField[y].length; x++)
            {
                var currentCell = this.gameField[y][x];
                if (currentCell == PLAYER_CHAR)
                {
                    this.players[this.players.length] = new Tank(x, y, PLAYER_CHAR, PLAYER_CONSTS, this);
                }
                else if (currentCell == ENEMY_CHAR)
                {
                    this.players[this.players.length] = new Tank(x, y, ENEMY_CHAR, ENEMY_CONSTS, this);
                }
                else if (currentCell == SPRINT_ENEMY_CHAR)
                {
                    this.players[this.players.length] = new Tank(x, y, SPRINT_ENEMY_CHAR, SPRINT_ENEMY_CONSTS, this);
                }
                else if (currentCell == ARMOR_ENEMY_CHAR)
                {
                    this.players[this.players.length] = new Tank(x, y, ARMOR_ENEMY_CHAR, ARMOR_ENEMY_CONSTS, this);
                }
            }
        }
    };

    this._drawPlayerHealth = function()
    {
        var healthBlock = $("#health");
        healthBlock.html("");
        if (this.player.health > MAX_VISIBLE_HEALTH)
        {
            var health = new Image();
            health.src = HEALTH_ADDRES;
            healthBlock.append(health, " x" + this.player.health);
        }
        else
        {
            for (var i = 0; i < this.player.health; ++i)
            {
                var health = new Image();
                health.src = HEALTH_ADDRES;
                healthBlock.append(health);
            }
        }
    };

    this._drawGrid = function()
    {
        ctx.strokeStyle = GRID_COLOR;
        ctx.beginPath();
        for (var i = 0; i < this.gameField[0].length; ++i)
        {
            ctx.moveTo(i * SQUARE_SIZE, 0);
            ctx.lineTo(i * SQUARE_SIZE, canvas.height);
        }
        for (var i = 0; i < this.gameField.length; ++i)
        {
            ctx.moveTo(0, i * SQUARE_SIZE);
            ctx.lineTo(canvas.width, i * SQUARE_SIZE);
        }
        ctx.stroke();
    };

    this._initPlayers();
    this.player = this.players[commonFunctionObj.findTank(this.players, PLAYER_CHAR)];
}