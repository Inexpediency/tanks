/**
 * Created by Vasiliy on 1/11/2016.
 */
function isTowerPosRight(angle, towerState)
{
    return angle == 0 && towerState == RIGHT_CHAR||
        angle == 90 && towerState == UP_CHAR||
        angle == 180 && towerState == LEFT_CHAR||
        angle == 270 && towerState == DOWN_CHAR
}

function isAngelRight(angle)
{
    return angle == 0 ||
        angle == 90 ||
        angle == 180||
        angle == 270 ||
        angle == 360
}

function isCharSame(char1, char2)
{
    return (char1 == char2) || (char1 == reverseChar(char2))
}

function getCurrentChar(deg)
{
    if (deg == 90)
    {
        return UP_CHAR;
    }
    else if (deg == 180)
    {
        return LEFT_CHAR;
    }
    else if (deg == 270)
    {
        return DOWN_CHAR;
    }
    else if (deg == 360 || deg == 0)
    {
        return RIGHT_CHAR;
    }
    return null;
}

function getXDirect(char)
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
}

function getYDirect(char)
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
}

function reverseChar(char)
{
    if (char == UP_CHAR)
    {
        return DOWN_CHAR;
    }
    else if (char == DOWN_CHAR)
    {
        return UP_CHAR;
    }
    else if (char == RIGHT_CHAR)
    {
        return LEFT_CHAR;
    }
    else if (char == LEFT_CHAR)
    {
        return RIGHT_CHAR;
    }
    return NOTHING_CHAR;
}

function translateCharInRightDeg(char)
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
}

function translateDividers(transleted, resultSystem)
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
    return 90;
}

function calcBodyAngle(startAngle, finalAngle, step)
{
    var finAngle = finalAngle == 0 && startAngle > 180 ? 360 : finalAngle;
    var stAngle = startAngle == 360 && finalAngle <= 180 ? 0 : startAngle;
    stAngle = startAngle == 0 && finalAngle > 180 ? 360 : startAngle;
    if (stAngle != finAngle &&
        Math.abs(stAngle - finAngle) != 180)
    {
        if (stAngle < finAngle)
        {
            return stAngle + step;
        }
        else
        {
            return stAngle - step;
        }
    }
    return stAngle;
}

function calcTowerAngel(startAngle, finalAngle, currentStep)
{
    var finAngle = finalAngle == 0 && startAngle > 180 ? 360 : finalAngle;
    if (startAngle != finAngle)
    {
        var stAngle = startAngle == 360 && finalAngle <= 180 ? 0 : startAngle;
        stAngle = startAngle == 0 && finalAngle > 180 ? 360 : startAngle;
        if (stAngle < finAngle)
        {
            return stAngle + currentStep;
        }
        else
        {
            return stAngle - currentStep;
        }
    }
    else
    {
        return startAngle == 360 ? 0 : startAngle;
    }
}

function calcHealth(x, y, field)
{
    var tank = findElement(x, y, field.enemy);
    if (field.enemy[tank] != null)
    {
        field.enemy[tank].health--;
        if (field.enemy[tank].health <= 0)
        {
            field.enemy.splice(tank, 1);
        }
        return 1;
    }
    return 0;
}

function inRad(angle)
{
    return -angle / 180 * Math.PI;
}


function randSign()
{
    if (Math.random() > 0.5)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}

function randNumb(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}