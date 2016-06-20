/**
 * Created by Vasiliy on 1/18/2016.
 */
var SHADOW_ADDRESS = "shadow.png";
var SHADOW_LEVEL = 43;
var DELAY = 32;

function Shadow()
{
    this.img = new Image();
    this.img.src = SHADOW_ADDRESS;
    this.level = SHADOW_LEVEL;
    this.canvas = document.getElementById("context");
    this.ctx = this.canvas.getContext("2d");

    this.drawShadow = function(step)
    {
        this.level = this.level + step;
        for (var i = 0; i < this.level; ++i)
        {
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

function ShadowMaker()
{
    this.shadow = new Shadow();
    var currItm = this;

    this.drawCameShadow = function()
    {
        $("body").css("display", "block");
        currItm.shadow.ctx.clearRect(0, 0, currItm.shadow.canvas.width, currItm.shadow.canvas.height);
        currItm.shadow.drawShadow(-1);
        if (currItm.shadow.level == 0)
        {
            currItm.shadow.canvas.style.width = "0";
            clearInterval(currItm.intervalId);
        }
    };

    this.drawGoOutShadow = function()
    {
        currItm.shadow.ctx.clearRect(0, 0, currItm.shadow.canvas.width, currItm.shadow.canvas.height);
        currItm.shadow.drawShadow(1);
        if (currItm.shadow.level == SHADOW_LEVEL)
        {
            clearInterval(currItm.intervalId);
            window.location = currItm.href;
        }
    };

    this.intervalId = setInterval(this.drawCameShadow, DELAY);

    this.setHandlers = function(arrEl)
    {
        arrEl.each(function()
        {
            var currEl = $(this);
            currEl.href = currEl.attr("href");
            currEl.removeAttr("href");

            if (currEl.attr("locked") == undefined || !currEl.attr("locked"))
            {
                currEl.on("click", handler);
            }
            else
            {
                currEl.bind("click", handler);
            }

            function handler()
            {
                currItm.href = currEl.href;
                currItm.shadow.canvas.style.width = "100%";
                currItm.intervalId = setInterval(currItm.drawGoOutShadow, DELAY);
            }
        });
    };

    this.goToHref = function(href)
    {
        currItm.href = href;
        currItm.shadow.canvas.style.width = "100%";
        currItm.intervalId = setInterval(currItm.drawGoOutShadow, DELAY);
    };

    this.setHandlers($("a"));
}