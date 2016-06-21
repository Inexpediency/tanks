/**
 * Created by Vasiliy on 2/22/2016.
 */
function MapManager()
{
    var BARRICADE_PROBABILITY = 40;
    var TRAVELED_BARRICADE_PROBABILITY = 32;
    var constants = require("./server_constants.js").constants;

    this.createMap = function(playerCount)
    {
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
        var nothingCharCount = this._findInArr(map, this._isFreePlace);
        if (nothingCharCount < playerCount)
        {
            return false;
        }
        var startPoint = this._findFirstTraveledPlace(map);
        var mapCopy = this._copyArray(map);
        var wave = new CheckPoint(mapCopy, startPoint, 1);
        wave.renumberMap();
        var foundNothingCharCount = this._findInArr(mapCopy, this._isNumber);
        return foundNothingCharCount == nothingCharCount;
    };

    this._findInArr = function(map, condition)
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

    this._isFreePlace = function(char)
    {
        return char == constants.TRAVELED_BARRICADE_CHAR ||
               char == constants.NOTHING_CHAR;
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

    this._copyArray = function(arr)
    {
        var result = [];
        for (var i = 0; i < arr.length; ++i)
        {
            if (typeof arr[i] == "object")
            {
                result[i] = this._copyArray(arr[i])
            }
            else
            {
                result[i] = arr[i];
            }
        }
        return result;
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