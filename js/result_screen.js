/**
 * Created by Vasiliy on 11/26/2015.
 */
window.addEventListener("DOMContentLoaded", initHtmlValues);

function initHtmlValues()
{
    var queryString = parseQueryString();
    var button = document.getElementById("button");
    var message = document.getElementById("message");
    var buttonImg = new Image();
    console.log(parseInt(queryString["isWin"]));
    if (parseInt(queryString["isWin"]))
    {
        message.innerHTML = "Победа!";
        button.href = button.href + "level=" + (parseInt(queryString["currentLevel"]) + 1) + "&";
        console.log(button.href);
        buttonImg.src = "./img/next_button.png";
        buttonImg.onload = function()
        {
            button.style.width = buttonImg.width + "px";
            button.style.height = buttonImg.height + "px";

            button.style.background = "url(\"" + PLAY_BUTTON_ADDRESS + "\") no-repeat";
        };
        button.onmouseover = function()
        {
            button.style.background = "url(\"" + PLAY_BUTTON_ADDRESS_HOVER + "\") no-repeat";
        };
        button.onmouseout = function()
        {
            button.style.background = "url(\"" + PLAY_BUTTON_ADDRESS + "\") no-repeat";
        };
        button.onclick = function()
        {
            button.style.background = "url(\"" + PLAY_BUTTON_ADDRESS_CLICK + "\") no-repeat";
        };
    }
    else
    {
        message.innerHTML = "Поражение...";
        button.href = button.href + "level=" + queryString["currentLevel"] + "&";
        buttonImg.src = "./img/restart_button.png";
        buttonImg.onload = function()
        {
            button.style.width = buttonImg.width + "px";
            button.style.height = buttonImg.height + "px";
            button.style.background = "url(\"img/restart_button.png\") no-repeat";
        };
        button.onmouseover = function()
        {
            button.style.background = "url(\"img/restart_button_hover.png\") no-repeat";
        };
        button.onmouseout = function()
        {
            button.style.background = "url(\"img/restart_button.png\") no-repeat";
        }
        button.onclick = function()
        {
            button.style.background = "url(\"img/restart_button_click.png\") no-repeat";
        };
    }
}