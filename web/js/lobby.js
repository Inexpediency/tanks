/**
 * Created by Vasiliy on 6/14/2016.
 */
$(window).ready(function()
{

    var shadow = new ShadowMaker();
    var userData = checkSessionData(shadow);
    var socket = io();

    socket.emit("userConnect", userData);
    socket.emit("getUsersList", userData.gameId);
    socket.emit("getLobbyName", userData.gameId);


    var button = $("#ready");
    var changNameButton = $("#change_nick");


    button.click(function()
    {
        changReadyState(userData);
        socket.emit("ready", userData);
    });

    changNameButton.click(function()
    {
        console.log(userData.ready);
        if (!userData.ready)
        {
            shadow.goToHref("ask_name.html");
        }
    });

    socket.on("lobbyName", function(lobbyName)
    {
        $("#lobby_name").html(lobbyName);
    });

    socket.on("userList", function(list)
    {
        fillUsersTable(list);
    });

    $(window).unload(function()
    {
        socket.emit("userDisconnected", userData);
    });
});

function changReadyState(userData)
{
    userData.ready = !userData.ready;
    window.sessionStorage.setItem("userData", JSON.stringify(userData));
}

function fillUsersTable(userList)
{
    var table = $("#players_list");
    var includingHtml = "";
    for (var i = 0; i < userList.length; ++i)
    {
        includingHtml += "<span class='row data_cell table_href'>";
        includingHtml += "  <span class='column first_column left'>" + (userList[i].name == "" ? "<pre> </pre>" : userList[i].name) + "</span>";
        includingHtml += "  <span class='column second_column left'>" + (userList[i].ready ? "Готов" : "Не готов") + "</span>";
        includingHtml += "</span>";
    }

    table.find(".data_cell").remove();
    table.find(".free").before(includingHtml);
}