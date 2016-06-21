/**
 * Created by Vasiliy on 6/21/2016.
 */
$(window).ready(function()
{

    var shadow = new ShadowMaker();
    var userData = checkSessionData(shadow);
    var socket = io();
    initHealthBlock();

    socket.emit("userConnect", userData);
    $(window).unload(function()
    {
        socket.emit("userDisconnected", userData);
    });
});


function initHealthBlock()
{
    var health = new Image();
    health.src = HEALTH_ADDRESS;
    $(health).load(function()
    {
        $("#health").width(health.width * MAX_VISIBLE_HEALTH + "px");
        $("#controlPanel").width(255 + parseInt($("#health").width()) + "px");
    });
}

function drawPlayerHealth(health)
{
    var healthBlock = $("#health");
    healthBlock.html("");
    if (health > MAX_VISIBLE_HEALTH)
    {
        var health = new Image();
        health.src = HEALTH_ADDRESS;
        healthBlock.append(health, " x" + health);
    }
    else
    {
        for (var i = 0; i < health; ++i)
        {
            var health = new Image();
            health.src = HEALTH_ADDRESS;
            healthBlock.append(health);
        }
    }
};