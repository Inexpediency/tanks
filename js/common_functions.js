/**
 * Created by Vasiliy on 11/25/2015.
 */
var g_shadow = new Image();
g_shadow.src = SHADOW_ADDRESS;
g_shadow.level = SHADOW_LEVEL;

var g_shadowCanvas;
var g_shadowCtx;
var g_intervalId;



function initContext()
{
    g_shadowCanvas = document.getElementById("context");
    g_shadowCtx = g_shadowCanvas.getContext("2d");
}

function parseQueryString()
{
    var qweryStr = window.location.href;
    var isPropName = 1;
    var prop = "";
    var propName = "";
    var result = {};
    for (var i = qweryStr.indexOf("?") + 1; i < qweryStr.length; ++i)
    {
        if (qweryStr[i] == "=")
        {
            isPropName = 0;
        }
        else if (qweryStr[i] == "&")
        {
            isPropName = 1;
            result[propName] = prop;
            propName = "";
            prop = "";
        }
        else if (qweryStr[i] != " ")
        {
            if (isPropName)
            {
                propName += qweryStr[i];
            }
            else
            {
                prop += qweryStr[i];
            }
        }
    }
    return result;
}

function drawShadow(step)
{
    g_shadow.level = g_shadow.level + step;
    for (var i = 0; i < g_shadow.level; ++i)
    {
        g_shadowCtx.drawImage(g_shadow, 0, 0, g_shadowCanvas.width, g_shadowCanvas.height);
    }
}