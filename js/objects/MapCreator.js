/**
 * Created by Vasiliy on 2/22/2016.
 */
function MapCreator()
{
    var commonFunctionObj = new CommonFunctionObj();

    this.createField = function()
    {
        var field = [];
        var FIELD_H = commonFunctionObj.randNumb(MIN_FIELD_LENGTH, MAX_FIELD_LENGTH);
        var FIELD_W = commonFunctionObj.randNumb(MIN_FIELD_LENGTH, MAX_FIELD_LENGTH);
        var playerCord = this._initPlayerPlace(field, FIELD_W, FIELD_H);
        var PROBABILITY_ENEMY_COUNT = commonFunctionObj.randNumb(MIN_ENEMY_COUNT, MAX_ENEMY_COUNT);
        var enemyDropProbability = PROBABILITY_ENEMY_COUNT / ((MAX_FIELD_LENGTH - 1) * (MAX_FIELD_LENGTH - 1));
        var barricadeDropProbability = BARRICADE_COUNT / ((FIELD_W - 1) * (FIELD_H - 1));
        var enemyCount = 0;
        for (var y = 0; y < FIELD_H; ++y)
        {
            field[y] = field[y] == undefined ? [] : field[y];
            for (var x = 0; x < FIELD_W; ++x)
            {
                if (field[y][x] != PLAYER_CHAR)
                {
                    if (y == 0 || x == 0 ||
                        x == FIELD_W - 1 ||
                        y == FIELD_H - 1)
                    {
                        field[y][x] = BARRICADE_CHAR;
                    }
                    else if (Math.random() < enemyDropProbability)
                    {
                        this._createTank(field, x, y);
                        enemyCount++;
                    }
                    else if (Math.random() < barricadeDropProbability)
                    {
                        this._createBarricade(field, x, y);
                    }
                    else
                    {
                        field[y][x] = NOTHING_CHAR;
                    }
                }
            }
        }
        if (enemyCount != 0 && this.checkField(playerCord, enemyCount, field))
        {
            return field;
        }
        else
        {
            return this.createField();
        }

    };

    this._initPlayerPlace = function(field, w, h)
    {
        var x = commonFunctionObj.randNumb(1, w - 2);
        var y = commonFunctionObj.randNumb(1, h - 2);
        field[y] = [];
        field[y][1] = PLAYER_CHAR;
        return {x: 1, y: y};
    };

    this._createTank = function(field, x, y)
    {
        var tank = commonFunctionObj.randNumb(0, 2);
        if (tank == 0)
        {
            field[y][x] = SPRINT_ENEMY_CHAR;
        }
        else if (tank == 1)
        {
            field[y][x] = ARMOR_ENEMY_CHAR;
        }
        else
        {
            field[y][x] = ENEMY_CHAR;
        }
    };

    this._createBarricade = function(field, x, y)
    {
        if (Math.random() > 0.5)
        {
            field[y][x] = TRAVELED_BARRICADE_CHAR;
        }
        else
        {
            field[y][x] = BARRICADE_CHAR;
        }
    };

    this.checkField = function(startPoint, enemyCount, field)
    {
        var findObj = {};
        findObj.findEnemyCount = 0;
        findObj.field = commonFunctionObj.copyArray(field);
        findObj.pointArr = [];
        var checkPoint = new CheckedPoint(startPoint.x, startPoint.y, findObj);
        checkPoint.check();
        return findObj.findEnemyCount == enemyCount;
    }
}

function CheckedPoint(x, y, findObj)
{
    this.x = x;
    this.y = y;
    findObj.field[y][x] = "C";

    this.check = function()
    {
        this._checkWay(this.x + 1, this.y);
        this._checkWay(this.x - 1, this.y);
        this._checkWay(this.x, this.y + 1);
        this._checkWay(this.x, this.y - 1);
    };

    this._checkWay = function(x, y)
    {
        if (findObj.field[y][x] == NOTHING_CHAR ||
            findObj.field[y][x] == TRAVELED_BARRICADE_CHAR)
        {
            findObj.pointArr[findObj.pointArr.length] = new CheckedPoint(x, y, findObj);
            findObj.pointArr[findObj.pointArr.length - 1].check();
        }
        else if (this._isEnemyChar(findObj.field[y][x]))
        {
            findObj.pointArr[findObj.pointArr.length] = new CheckedPoint(x, y, findObj);
            findObj.pointArr[findObj.pointArr.length - 1].check();
            findObj.findEnemyCount++;
        }
    };

    this._isEnemyChar = function(char)
    {
        return (char == ARMOR_ENEMY_CHAR ||
                char == ENEMY_CHAR ||
                char == SPRINT_ENEMY_CHAR);
    };
}