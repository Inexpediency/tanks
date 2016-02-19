/**
 * Created by Vasiliy on 1/6/2016.
 */
function Field(currentLevel)
{
    var commonFunctionObj = new CommonFunctionObj();
    this.eventController = new EventController();
    var canvas = document.getElementById("gameField");
    var ctx = canvas.getContext("2d");

    this.currentLevel = currentLevel;
    this.gameField = commonFunctionObj.copyArray(g_levels[currentLevel]);//потом надо сделать через сервер и AJAX
    this.players = [];
    this.balls = [];
    this.bangs = [];
    this.bonus = [];
    this.barricades = [];

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
        commonFunctionObj.drawArrObj(this.balls);
        commonFunctionObj.drawArrObj(this.bonus);
        commonFunctionObj.drawArrObj(this.players);
        commonFunctionObj.drawArrObj(this.barricades);
        commonFunctionObj.drawArrObj(this.bangs);
        this._drawPlayerHealth();
    };

    this._initFieldElements = function()
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
                else if (currentCell == BARRICADE_CHAR)
                {
                    this.barricades[this.barricades.length] = new Barricade(x * SQUARE_SIZE, y * SQUARE_SIZE,
                        this.barricadeImg, BARRICADE_CHAR);
                }
                else if (currentCell == TRAVELED_BARRICADE_CHAR)
                {
                    this.barricades[this.barricades.length] = new Barricade(x * SQUARE_SIZE, y * SQUARE_SIZE,
                        this.traveledBarricadeImg, TRAVELED_BARRICADE_CHAR);
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

    this._createBonus = function(x, y)
    {
        var randNumb = commonFunctionObj.randNumb(1, 4);
        var bonus;
        if (randNumb == 1)
        {
            bonus = new HealthBonus();
        }
        else if (randNumb == 2)
        {
            bonus = new SpeedBonus();
        }
        else if (randNumb == 3)
        {
            bonus = new TowerSpeedBonus();
        }
        else
        {
            bonus = new FireSpeedBonus();
        }
        if (this.bonus.length < MAX_BONUS_COUNT &&
            bonus.dropeChance > commonFunctionObj.randNumb(1, 100))
        {
            this.bonus[this.bonus.length] = new Bonus(x, y, SQUARE_SIZE, SQUARE_SIZE, bonus, this);
        }
    };

    var curItm = this;
    this.eventController.listen("tankDestroyed", function(tank)
    {
        curItm._createBonus(tank.x, tank.y);
        curItm.players.splice(commonFunctionObj.findElement(tank.x, tank.y, curItm.players), 1);
    });

    this._initFieldElements();
    this.player = this.players[commonFunctionObj.findTank(this.players, PLAYER_CHAR)];
}