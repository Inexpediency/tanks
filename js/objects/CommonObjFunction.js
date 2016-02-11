/**
 * Created by Vasiliy on 1/11/2016.
 */
function CommonFunctionObj()
{
    this.canvas = document.getElementById("gameField");
    this.ctx = this.canvas.getContext("2d");

    this.copyArray = function(arr)
    {
        var result = [];
        for (var i = 0; i < arr.length; ++i)
        {
            result[i] = arr[i].slice();
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

    this.findTank = function(arr, tankChar)
    {
        var tanks = [];
        for (var i = 0; i < arr.length; ++i)
        {
            if (arr[i].character == tankChar)
            {
                tanks[tanks.length] = i;
            }
        }
        if (tanks[1] == undefined)
        {
            tanks = tanks[0];
        }
        return tanks;
    };

    this.drawArrObj = function(arr)
    {
        for (var i = 0; i < arr.length; i++)
        {
            arr[i].draw();
        }
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
        if (char == RIGHT_CHAR)
        {
            return 1;
        }
        else if (char == LEFT_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this.getYDirect = function(char)
    {
        if (char == DOWN_CHAR)
        {
            return 1;
        }
        else if (char == UP_CHAR)
        {
            return -1;
        }
        return 0;
    };

    this.translateCharInRightDeg = function(char)
    {
        if (char == UP_CHAR)
        {
            return 90;
        }
        else if (char == LEFT_CHAR)
        {
            return 180;
        }
        else if (char == DOWN_CHAR)
        {
            return 270;
        }
        else if (char == RIGHT_CHAR)
        {
            return 0;
        }
        return NaN;
    };

    this.translateRightDegInChar = function(char)
    {
        if (char == 90)
        {
            return UP_CHAR;
        }
        else if (char == 180)
        {
            return LEFT_CHAR;
        }
        else if (char == 270)
        {
            return DOWN_CHAR;
        }
        else if (char == 0)
        {
            return RIGHT_CHAR;
        }
        return NaN;
    };

    this.inRad = function(angle)
    {
        return -angle / 180 * Math.PI;
    };


    this.randSign = function()
    {
        if (Math.random() > 0.5)
        {
            return 1;
        }
        else
        {
            return -1;
        }
    };

    this.randNumb = function(min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    };


    this.drawRotatedObj = function(angle, img, x, y, w, h, isTower)
    {
        this.ctx.translate(x, y);
        this.ctx.rotate(this.inRad(angle));
        if (isTower)
        {
            this.ctx.drawImage(img, -w / 5, -h / 2, w, h);
        }
        else
        {
            this.ctx.drawImage(img, -w / 2, -h / 2, w, h);
        }
        this.ctx.rotate(-this.inRad(angle));
        this.ctx.translate(-x, -y);
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
    }
}