/**
 * Created by Vasiliy on 1/11/2016.
 */
function copyArray(arr)
{
    var result = [];
    for (var i = 0; i < arr.length; ++i)
    {
        result[i] = arr[i].slice();
    }
    return result;
}


function findElement(x, y, mas)
{
    for (var i = 0; i < mas.length; ++i)
    {
        if (x == mas[i].x && y == mas[i].y)
        {
            return i;
        }
    }
    return null;
}

function findTank(arr, tankChar)
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
}


function drawArrObj(arr)
{
    for (var i = 0; i < arr.length; i++)
    {
        arr[i].draw();
    }
}

function moveArrObj(arr)
{
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i].move())
        {
            arr.splice(i, 1);
        }
    }
}

function drawObjects(field)
{
    var angle = 0;
    var currentEl;
    for (var y = 0; y < field.gameField.length; ++y)
    {
        for (var x = 0; x < field.gameField[y].length; ++x)
        {
            currentEl = field.gameField[y][x];
            angle +=  30;
            if (currentEl == TRAVELED_BARRICADE_CHAR)
            {
                drawRotatedObj(angle, g_traveledBarricade, x * SQUARE_SIZE + 0.5 * SQUARE_SIZE, y * SQUARE_SIZE + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
            }
            else if (currentEl == BARRICADE_CHAR)
            {

                drawRotatedObj(angle, g_barricade, x * SQUARE_SIZE + 0.5 * SQUARE_SIZE, y * SQUARE_SIZE + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
            }
            else if (currentEl == BALL_CHAR)
            {
                field.balls[findElement(x, y, field.balls)].draw();
            }
            else if (currentEl != NOTHING_CHAR)
            {
                field.enemy[findElement(x, y, field.enemy)].draw();
            }
        }
    }
}


function createSmokeParticles(x, y, angle, smokeArr)
{
    var calcX;
    var calcY;
    for (var i = 0; i < SMOKE_COUNT; ++i)
    {
        calcX = x;
        calcY = y;
        calcX += SQUARE_SIZE * 0.5;
        calcY += SQUARE_SIZE * 0.5;
        calcX += randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.cos(inRad(angle));
        calcY += randNumb(-SQUARE_SIZE / 8, SQUARE_SIZE / 8) * Math.sin(inRad(angle));
        if ((getCurrentChar(angle) == UP_CHAR || (getCurrentChar(angle) == DOWN_CHAR)))
        {
            calcX += randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
        }
        if ((getCurrentChar(angle) == RIGHT_CHAR || (getCurrentChar(angle) == LEFT_CHAR)))
        {
            calcY += randNumb(-SQUARE_SIZE / 12, SQUARE_SIZE / 12)
        }
        smokeArr[smokeArr.length] = new DynamicParticle(g_smokeImg, calcX, calcY,
            0, 0,
            LAST_X_SMOKE_STATE, LAST_Y_SMOKE_STATE,
            SQUARE_SIZE / 2, SQUARE_SIZE / 2);
    }
}

function createDustParticles(x, y, finalAngle, angle, motion, dustArr)
{
    var calcX;
    var calcY;
    var calcAngle;
    for (var i = 0; i < DUST_COUNT; ++i)
    {
        calcX = x;
        calcY = y;
        if (!isAngelRight(angle))
        {
            calcAngle = angle;
            calcX += SQUARE_SIZE * 0.5;
            calcY += SQUARE_SIZE * 0.5;
            if (calcAngle < finalAngle || (finalAngle == 0 && calcAngle >= 180))
            {
                calcAngle += (randSign() >= 0) * 180;
                calcAngle = inRad(calcAngle);
                calcY += SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                calcX -= SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
            }
            else
            {
                calcAngle += (randSign() >= 0) * 180;
                calcAngle = inRad(calcAngle);
                calcY -= SQUARE_SIZE * 0.25 * Math.cos(calcAngle);
                calcX += SQUARE_SIZE * 0.25 * Math.sin(calcAngle);
            }
            var radius = randNumb(0, SQUARE_SIZE / 2.25);
            calcX += Math.cos(calcAngle) * radius;
            calcY += Math.sin(calcAngle) * radius;
        }
        else if (motion == DOWN_CHAR)
        {
            calcX += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcY += SQUARE_SIZE + randNumb(-SQUARE_SIZE, 0);
        }
        else if (motion == UP_CHAR)
        {
            calcX += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcY += randNumb(0, SQUARE_SIZE);
        }
        else if (motion == RIGHT_CHAR)
        {
            calcY += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcX += SQUARE_SIZE + randNumb(-SQUARE_SIZE, 0);
        }
        else if (motion == LEFT_CHAR)
        {
            calcY += SQUARE_SIZE / 4 + randNumb(0, SQUARE_SIZE / 2);
            calcX += randNumb(0, SQUARE_SIZE);
        }
        dustArr[dustArr.length] = new DynamicParticle(g_dustImg, calcX, calcY, 0, 0, LAST_X_DUST_STATE, LAST_Y_DUST_STATE, SQUARE_SIZE / 40, SQUARE_SIZE / 40);
    }
}