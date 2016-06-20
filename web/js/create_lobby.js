/**
 * Created by Vasiliy on 6/14/2016.
 */
$(window).ready(function()
{
    var shadow = new ShadowMaker();
    var socket = io();
    var button = $("#lobby_data_button");
    button.attr("locked", true);

    button.on("click", function()
    {
        var data = {};
        data.name = $("#lobby_name").val();
        data.userCount = $("#player_count").val();
        socket.emit("createGame", data);
    });

    socket.on("dispatchId", function(gameData)
    {
        window.sessionStorage.setItem("userData", JSON.stringify(gameData));
        $(button).trigger("click");
    });

    $(window).unload(function()
    {
        socket.emit("userDisconnected", $.parseJSON(window.sessionStorage.getItem("userData")));
    });
});