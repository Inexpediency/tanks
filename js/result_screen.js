/**
 * Created by Vasiliy on 11/26/2015.
 */
$(window).ready(function()
{
    var queryString = parseQueryString();
    console.log(queryString);
    var button = new Button;
    if (queryString["currentLevel"] != "r")
    {
        if (parseInt(queryString["isWin"]))
        {
            button.init("Победа!", "img/next_button", parseInt(queryString["currentLevel"]) + 1);
        }
        else
        {
            button.init("Поражение...", "img/restart_button", queryString["currentLevel"]);
        }
    }
    else
    {
        if (parseInt(queryString["isWin"]))
        {
            button.init("Победа!", "img/next_button", queryString["currentLevel"]);
        }
        else
        {
            button.init("Поражение...", "img/restart_button", queryString["currentLevel"]);
        }
    }
    var shadowMaker = new ShadowMaker();
});

function Button()
{
    this.element = $("#button");
    this.message = $("#message");
    this.img = new Image();
    this.init = function(message, address, level)
    {
        this.message.html(message);
        this.element.attr("href", (this.element.attr("href") + "level=" + level + "&"));
        this.img.src = address + ".png";
        var thisPtr = this;
        this.img.onload = function()
        {
            thisPtr.element.css("width", thisPtr.img.width + "px");
            thisPtr.element.css("height", thisPtr.img.height + "px");
            thisPtr.element.css("background", "url(\"" + address + ".png\") no-repeat");
        };
        this.element.mouseover(function()
        {
            thisPtr.element.css("background", "url(\"" + address + "_hover.png\") no-repeat");
        });
        this.element.mouseout(function()
        {
            thisPtr.element.css("background", "url(\"" + address + ".png\") no-repeat");
        });
        this.element.mousedown(function()
        {
            thisPtr.element.css("background", "url(\"" + address + "_click.png\") no-repeat");
        });
    }
}