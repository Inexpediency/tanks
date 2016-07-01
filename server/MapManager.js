/**
 * Created by Vasiliy on 2/22/2016.
 */
function MapManager()
{
    var BARRICADE_PROBABILITY = 26;
    var TRAVELED_BARRICADE_PROBABILITY = 32;
    var CommonFuncObj = require("./CommonFuncObj.js");
    var constants = require("../common/constants.js").constants;
    this.commonFunc = new CommonFuncObj();

    this.createMap = function(playerCount)
    {
        playerCount = isNaN(parseInt(playerCount) ? constants.MAX_PLAYERS_COUNT : parseInt(playerCount));
        var result = [[]];
        for (var i = 0; i < constants.FIELD_Y_SIZE; ++i)
        {
            result[i] = [];
            for (var j = 0; j < constants.FIELD_X_SIZE; ++j)
            {
                if (j == 0 || i == 0 || i == constants.FIELD_Y_SIZE - 1 || j == constants.FIELD_X_SIZE - 1)
                {
                    result[i][j] = constants.BARRICADE_CHAR;
                }
                else
                {
                    this._generateBlock(result, i, j);
                }
            }
        }
        return (this._checkMap(result, playerCount)) ? result : this.createMap();
    };

    this._generateBlock = function(arr, y, x)
    {
        var probability = Math.random() * 100;
        if (probability <= BARRICADE_PROBABILITY)
        {
            arr[y][x] = constants.BARRICADE_CHAR;
        }
        else if (probability <= BARRICADE_PROBABILITY + TRAVELED_BARRICADE_PROBABILITY)
        {
            arr[y][x] = constants.TRAVELED_BARRICADE_CHAR;
        }
        else
        {
            arr[y][x] = constants.NOTHING_CHAR;
        }
    };

    this._checkMap = function(map, playerCount)
    {
        var nothingCharCount = this._countElementInMap(map, this.commonFunc.isFreePlace);
        if (nothingCharCount < playerCount)
        {
            return false;
        }
        var startPoint = this._findFirstTraveledPlace(map);
        var mapCopy = this.commonFunc.copyArray(map);
        var wave = new CheckPoint(mapCopy, startPoint, 1);
        wave.renumberMap();
        var foundNothingCharCount = this._countElementInMap(mapCopy, this._isNumber);
        return foundNothingCharCount == nothingCharCount;
    };

    this._countElementInMap = function(map, condition)
    {
        var result = 0;
        for (var i = 0; i < map.length; ++i)
        {
            for (var j = 0; j < map[i].length; ++j)
            {
                if (condition(map[i][j]))
                {
                    result++;
                }
            }
        }
        return result;
    };

    this._isNumber = function(numb)
    {
        return !isNaN(numb);
    };

    this._findFirstTraveledPlace = function(map)
    {
        for (var i = 0; i < map.length; ++i)
        {
            for (var j = 0; j < map[i].length; ++j)
            {
                if (map[i][j] == constants.TRAVELED_BARRICADE_CHAR ||
                    map[i][j] == constants.NOTHING_CHAR)
                {
                    return {y: i, x: j};
                }

            }
        }
    };

    this.logMap = function(map)
    {
        var result = "";
        for (var i = 0; i < map.length; ++i)
        {
            for (var j = 0; j < map[i].length; ++j)
            {
                if (map[i][j] == constants.BARRICADE_CHAR)
                {
                    result = result + "#";
                }
                else
                {
                    result = result + " ";
                }
                result = result + ((j == map[i].length - 1) ? "": " ");
            }
            result = result + "\n"
        }
        console.log(result);
    };

    function CheckPoint(map, startPoint, level)
    {
        map[startPoint.y][startPoint.x] = level;

        this.renumberMap = function()
        {
            this.createPoint(startPoint.y, startPoint.x - 1);
            this.createPoint(startPoint.y, startPoint.x + 1);
            this.createPoint(startPoint.y - 1, startPoint.x);
            this.createPoint(startPoint.y + 1, startPoint.x)
        };
        this.createPoint = function(y, x)
        {
            if (map[y][x] == constants.TRAVELED_BARRICADE_CHAR ||
                map[y][x] == constants.NOTHING_CHAR)
            {
                var nextLevel = level + 1;
                var newCheckPoint = new CheckPoint(map, {y: y, x: x}, nextLevel);
                newCheckPoint.renumberMap();
            }
        };
    }

    return this;
}

module.exports = MapManager;