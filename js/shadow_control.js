/**
 * Created by Vasiliy on 12/29/2015.
 */
var g_url;

$(window).ready(function()
{
    initContext();
    g_intervalId = setInterval(drawCameShadow, DELAY);
    $("a").each(function()
    {
        var currEl = $(this);
        currEl.hrefTemp = currEl.attr("href");
        currEl.removeAttr("href");
        currEl.click(function()
        {
            g_context.style.width = "100%";
            g_url = currEl.hrefTemp;
            clearInterval(g_intervalId);
            g_intervalId = setInterval(drawGoOutShadow, DELAY);
        });
    });
});

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
    $("body").css("display", "block");
    g_contextCtx.clearRect(0, 0, g_context.width, g_context.height);
    drawShadow(0, -1);
    if (0 >= g_shadow.level)
    {
        clearInterval(g_intervalId);
        g_context.style.width = "0";
    }
}