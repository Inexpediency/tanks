/**
 * Created by Vasiliy on 11/25/2015.
 */
var g_shadow = new Image();
g_shadow.src = SHADOW_ADDRESS;
g_shadow.level = SHADOW_LEVEL;

var g_context;
var g_contextCtx;
var g_intervalId;
var g_url;


function getFileName()
{
    var url = window.location.href;
    while (url.indexOf("/") != -1)
    {
        url = url.substring(url.indexOf("/") + 1, url.length);
    }
    if (url.indexOf("?") != -1)
    {
        url = url.substring(0, url.indexOf("?"));
    }
    return url;
}

if (getFileName(window.location.href) != "index.html")
{
    window.addEventListener("DOMContentLoaded", shadowControl);
    function shadowControl()
    {
        initContext();
        g_intervalId = setInterval(drawCameShadow, DELAY);
        var aTags = document.getElementsByTagName("a");
        for (var i = 0; i < aTags.length; ++i)
        {
            aTags[i].hrefTemp = aTags[i].href;
            aTags[i].removeAttribute("href");
            aTags[i].onclick = function ()
            {
                g_context.style.width = "100%";
                g_url = this.hrefTemp;
                this.removeAttribute("href");
                clearInterval(g_intervalId);
                g_intervalId = setInterval(drawGoOutShadow, DELAY);
            };
        }
    };
}

function drawGoOutShadow()
{
    g_contextCtx.clearRect(0, 0, g_context.width, g_context.height);
    drawShadow(SHADOW_LEVEL, 1);
    if (SHADOW_LEVEL <= g_shadow.level)
    {
        clearInterval(g_intervalId);
        window.location = g_url;
        console.log(g_url);
    }
}

function drawCameShadow()
{
    g_contextCtx.clearRect(0, 0, g_context.width, g_context.height);
    drawShadow(0, -1);
    document.body.style.display = "block";
    if (0 >= g_shadow.level)
    {
        clearInterval(g_intervalId);
        g_context.style.width = "0";
    }
}

function initContext()
{
    g_context = document.getElementById("context");
    g_contextCtx = g_context.getContext("2d");
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

function drawShadow(last, step)
{
    if ((g_shadow.level < last && step > 0) ||
        (g_shadow.level > last && step < 0))
    {
        g_shadow.level = g_shadow.level + step;
    }
    for (var i = 0; i < g_shadow.level; ++i)
    {
        g_contextCtx.drawImage(g_shadow, 0, 0, g_context.width, g_context.height);
    }
}