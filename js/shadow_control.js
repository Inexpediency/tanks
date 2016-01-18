/**
 * Created by Vasiliy on 12/29/2015.
 */

$(window).ready(function()
{
    var shadowMaker = new ShadowMaker();
    $("a").each(function()
    {
        var currEl = $(this);
        currEl.href = currEl.attr("href");
        currEl.removeAttr("href");
        currEl.click(function()
        {
            shadowMaker.href = currEl.href;
            shadowMaker.shadow.canvas.style.width = "100%";
            shadowMaker.intervalId = setInterval(shadowMaker.drawGoOutShadow, DELAY);
        });
    });
});

function ShadowMaker()
{
    this.shadow = new Shadow();

    var currItm = this;
    this.drawCameShadow = function()
    {
        console.log(currItm.shadow.level);
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
}