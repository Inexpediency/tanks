/**
 * Created by Vasiliy on 6/21/2016.
 */
function Field(gameField, gameEvent)
{
    var constants = require("../common/constants.js").constants;
    var CommonFuncObj = require("./CommonFuncObj.js");
    var EventController = require("../common/EventController");
    var Barricade = require("./Barricade.js");
    var Bonus = require("./Bonus.js");
    var HealthBonus = require("./bonuses/HealthBonus.js");
    var FireSpeedBonus = require("./bonuses/FireSpeedBonus.js");
    var SpeedBonus = require("./bonuses/SpeedBonus.js");
    var TowerSpeedBonus = require("./bonuses/TowerSpeedBonus.js");

    var Collisions = require("./Collisions.js");
    this.collisions = new Collisions();
    this.commonFunc = new CommonFuncObj();
    this.eventController = new EventController();

    this.tanks = [];
    this.barricades = [];

    var thisPtr = this;

    this.init = function()
    {
        this.bonus = [];
        this.balls = [];
        this.bangs = [];
        this._initBarricades();
    };

    this._initBarricades = function()
    {
        for (var i = 0; i < this.barricades.length; ++i)
        {
            this.barricades[i].health = constants.BARRICADE_HEALTH;
        }
    };

    this._createBarricade = function()
    {
        for (var i = 0; i < gameField.length; ++i)
        {
            for (var j = 0; j < gameField[i].length; ++j)
            {
                if (gameField[i][j] == constants.BARRICADE_CHAR ||
                    gameField[i][j] == constants.TRAVELED_BARRICADE_CHAR)
                {
                    this.barricades[this.barricades.length] = new Barricade(j, i, constants.BARRICADE_HEALTH, gameField[i][j]);
                }
            }
        }
    };

    this.getRandomPlaceFor = function(obj)
    {
        var isFound = false;
        while (!isFound)
        {
            var startYPoint = this.commonFunc.randNumb(1, gameField.length - 1);
            var startXPoint = this.commonFunc.randNumb(1, gameField[startYPoint].length - 1);
            var x = startXPoint * constants.ELEMENT_SIZE + 0.5 * constants.ELEMENT_SIZE;
            var y = startYPoint * constants.ELEMENT_SIZE + 0.5 * constants.ELEMENT_SIZE;
            obj.x = x;
            obj.y = y;
            obj.health = 1;
            if (gameField[startYPoint][startXPoint] == constants.NOTHING_CHAR)
            {
                isFound = true;
            }
            if (gameField[startYPoint][startXPoint] == constants.TRAVELED_BARRICADE_CHAR)
            {
                var index = this._getBarricadeByCord(x, y);
                this.barricades[index].health = 0;
                isFound = true;
            }
            if (isFound)
            {
                isFound = !this.collisions.isIntersectedObj(obj, this.tanks);
            }
        }
        return {x: startXPoint, y: startYPoint};
    };

    this.getFieldState = function()
    {
        var result = {};
        result.tanks = this._getTanksData();
        result.balls = this._getBallsData();
        result.barricades = this._getBarricadesData();
        result.bonus = this._getBonusData();
        result.bangs = this._getBangsData();
        return result;
    };

    this._getBangsData = function()
    {
        var result = [];
        for (var i = 0; i < this.bangs.length; ++i)
        {
            result[i] = {};
            result[i].x = this.bangs[i].x;
            result[i].y = this.bangs[i].y;
            result[i].stageX = this.bangs[i].stateX;
            result[i].stageY = this.bangs[i].stateY;
        }
        return result;
    };

    this._getBonusData = function()
    {
        var result = [];
        for (var i = 0; i < this.bonus.length; ++i)
        {
            result[i] = {};
            result[i].x = this.bonus[i].x;
            result[i].y = this.bonus[i].y;
            result[i].stageX = this.bonus[i].stageX;
            result[i].stageY = this.bonus[i].stageY;
            result[i].character = this.bonus[i].type.character;
        }
        return result;
    };

    this._getBarricadesData = function()
    {
        var result = [];
        var j = 0;
        for (var i = 0; i < this.barricades.length; ++i)
        {
            if (this.barricades[i].health != 0)
            {
                result[j] = {};
                result[j].x = this.barricades[i].x;
                result[j].y = this.barricades[i].y;
                result[j].angle = this.barricades[i].angle;
                result[j].character = this.barricades[i].character;
                j++;
            }
        }
        return result;
    };

    this._getBallsData = function()
    {
        var result = [];
        for (var i = 0; i < this.balls.length; ++i)
        {
            result[i] = {};
            result[i].x = this.balls[i].x;
            result[i].y = this.balls[i].y;
            result[i].route = this.balls[i].route;
            result[i].width = this.balls[i].width;
            result[i].height = this.balls[i].height;
        }
        return result;
    };

    this._getTanksData = function()
    {
        var result = [];
        var j = 0;
        for (var i = 0; i < this.tanks.length; ++i)
        {
            if (this.tanks[i].health != 0)
            {
                result[j] = {};
                result[j].userId = this.tanks[i].userId;
                result[j].x = this.tanks[i].x;
                result[j].y = this.tanks[i].y;
                result[j].angle = this.tanks[i].angle;
                result[j].finalBodeState = this.tanks[i].finalBodeState;
                result[j].towerAngle = this.tanks[i].towerAngle;
                result[j].health = this.tanks[i].health;
                result[j].motion = this.tanks[i].motion;
                j++;
            }
        }
        return result;
    };

    this._getBarricadeByCord = function(x, y)
    {
        for (var i = 0; i < this.barricades.length; ++i)
        {
            if (this.barricades[i].x == x && this.barricades[i].y == y)
            {
                return i;
            }
        }
        return null;
    };

    this.refreshState = function()
    {
        this.commonFunc.moveArrObj(this.balls);
        this.commonFunc.moveArrObj(this.bangs);
        this.commonFunc.moveArrObj(this.tanks);
        this.commonFunc.moveArrObj(this.bonus);
    };

    this._createBonus = function(x, y)
    {
        var bonus = this._chooseBonusType();
        if (this.bonus.length < constants.MAX_BONUS_COUNT &&
            bonus.dropeChance > this.commonFunc.randNumb(1, 100))
        {
            this.bonus[this.bonus.length] = new Bonus(x, y, constants.ELEMENT_SIZE, constants.ELEMENT_SIZE, bonus, this);
        }
    };

    this._chooseBonusType = function()
    {
        var randNumb = this.commonFunc.randNumb(1, 4);
        if (randNumb == 1)
        {
            return new HealthBonus();
        }
        else if (randNumb == 2)
        {
            return new SpeedBonus();
        }
        else if (randNumb == 3)
        {
            return new TowerSpeedBonus();
        }
        else
        {
            return new FireSpeedBonus();
        }
    };

    this.getTankNumbById = function(id)
    {
        for (var i = 0; i < this.tanks.length; ++i)
        {
            if (this.tanks[i].userId = id)
            {
                return i;
            }
        }
    };

    this.eventController.listen("tankDestroyed", function(tank)
    {
        thisPtr._createBonus(tank.x, tank.y);
        gameEvent.dispatch("tankDestroyed", tank);
    });

    this.eventController.listen("tankDamaged", function(ball)
    {
        for (var i = 0; i < thisPtr.tanks.length; ++i)
        {
            if (thisPtr.collisions.getIntersection(thisPtr.tanks[i], ball))
            {
                thisPtr.tanks[i].calcHealth(ball);
            }
        }
    });

    this.eventController.listen("bangOver", function(bang)
    {
        for (var i = 0; i < thisPtr.barricades.length; ++i)
        {
            if (thisPtr.barricades[i].character == constants.TRAVELED_BARRICADE_CHAR &&
                thisPtr.collisions.getIntersection(thisPtr.barricades[i], bang))
            {
                thisPtr.barricades[i].health--;
            }
        }
    });

    this._createBarricade();

    return this;
}

module.exports = Field;
