/**
 * Created by Vasiliy on 6/20/2016.
 */
$(window).ready(function()
{
    var shadow = new ShadowMaker();
    var userData = checkSessionData(shadow);
    var socket = io();

    socket.emit("userConnect", userData);

    $("#ask_name_button").on("mousedown", function()
    {
        var clientData = {};
        clientData.name = $("#nickname").val();
        clientData.gameId = userData.gameId;
        clientData.userId = userData.userId;
        socket.emit("initName", clientData);
    });

    $(window).unload(function()
    {
        socket.emit("userDisconnected", $.parseJSON(window.sessionStorage.getItem("userData")));
    });
});
