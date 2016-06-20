/**
 * Created by Vasiliy on 6/14/2016.
 */
$(window).ready(function()
{
    $("#lobby_screen").attr("locked", true);
    var shadow = new ShadowMaker();
    var userData = checkSessionData(shadow);
    var socket = io();
    socket.emit("userConnect", userData);

    var button = $("#ready");
    button.attr("locked", true);
    socket.emit("getUsersList", userData.gameId);
    socket.emit("getLobbyName", userData.gameId);

    button.click(function()
    {
        socket.emit("ready", userData);
    });

    socket.on("lobbyName", function(lobbyName)
    {
        $("#lobby_name").val(lobbyName);
    });

    socket.on("userList", function(list)
    {
        console.log(list);
        fillUsersTable(list);
    });

    $(window).unload(function()
    {
        socket.emit("userDisconnected", userData);
    });
});

function fillUsersTable(userList)
{
    var table = $("#players_list");
    var includingHtml = "";
    for (var i = 0; i < userList.length; ++i)
    {
        includingHtml += "<span class='row data_cell table_href'>";
        includingHtml += "  <span class='column first_column left'>" + userList[i].name + "</span>";
        includingHtml += "  <span class='column second_column left'>" + (userList[i].ready ? "Готов" : "Не готов") + "</span>";
        includingHtml += "</span>";
    }

    table.find(".data_cell").remove();
    table.find(".free").before(includingHtml);
}