/**
 * Created by Vasiliy on 1/11/2016.
 */
function CommonFunctionObj()
{
    var constants = require("../common/constants.js").constants;

    this.isFreePlace = function(char)
    {
        return char == constants.TRAVELED_BARRICADE_CHAR ||
               char == constants.NOTHING_CHAR;
    };

    this.copyArray = function(arr)
    {
        var result = [];
        for (var i = 0; i < arr.length; ++i)
        {
            if (typeof arr[i] == "object")
            {
                result[i] = this.copyArray(arr[i])
            }
            else
            {
                result[i] = arr[i];
            }
        }
        return result;
    };

    this.findElement = function(x, y, mas)
    {
        for (var i = 0; i < mas.length; ++i)
        {
            if (x == mas[i].x && y == mas[i].y)
            {
                return i;
            }
        }
        return null;
    };

    this.moveArrObj = function(arr)
    {
        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].move())
            {
                arr.splice(i, 1);
            }
        }
    };

    this.getXDirect = function(char)
    {
        if (char == constants.RIGHT_CHAR)
        {
            return 1;
        }
        else if (char == constants.LEFT_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this.getYDirect = function(char)
    {
        if (char == constants.DOWN_CHAR)
        {
            return 1;
        }
        else if (char == constants.UP_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this._translateCharInRightDeg = function(char)
    {
        if (char == constants.UP_CHAR)
        {
            return 90;
        }
        else if (char == constants.LEFT_CHAR)
        {
            return 180;
        }
        else if (char == constants.DOWN_CHAR)
        {
            return 270;
        }
        else if (char == constants.RIGHT_CHAR)
        {
            return 0;
        }
        return NaN;
    };

    this.translateRightDegInChar = function(char)
    {
        if (char == 90)
        {
            return constants.UP_CHAR;
        }
        else if (char == 180)
        {
            return constants.LEFT_CHAR;
        }
        else if (char == 270)
        {
            return constants.DOWN_CHAR;
        }
        else if (char == 0)
        {
            return constants.RIGHT_CHAR;
        }
        return NaN;
    };

    this.inRad = function(angle)
    {
        return -angle / 180 * Math.PI;
    };

    this.randNumb = function(min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    this.isAngelRight = function(angle)
    {
        return angle == 0 ||
            angle == 90 ||
            angle == 180||
            angle == 270 ||
            angle == 360
    };

    this.translateDividers = function(transleted, resultSystem)
    {
        var factorNumbCount = 0;
        for (var i = 2; i <= transleted; i++)
        {
            if (transleted % i == 0)
            {
                factorNumbCount++;
            }
        }
        for (var i = 2; i <= resultSystem; i++)
        {
            if (resultSystem % i == 0)
            {
                factorNumbCount--;
                if (factorNumbCount <= 0)
                {
                    return i;
                }
            }
        }
        return resultSystem;
    };

    this.nextDivider = function(numb, syst)
    {
        for (var i = 2; i <= syst; i++)
        {
            if (syst % i == 0 && numb < i)
            {
                return i;
            }
        }
    };

    return this;
}

module.exports = CommonFunctionObj;