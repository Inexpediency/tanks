/**
 * Created by Vasiliy on 6/13/2016.
 */
$(window).ready(function()
{
    var shadow = new ShadowMaker();

    var socket = io();
    socket.emit("getGameData", 1);

    socket.on("gameList", function(data)
    {
        console.log(data);
        fillTable(data, socket, shadow);
    });

    socket.on("dispatchId", function(gameData)
    {
        window.sessionStorage.setItem("userData", JSON.stringify(gameData));
        $("#" + gameData.gameId).trigger("click");
        socket.emit("userDisconnected", gameData);
    });
});

function fillTable(data, socket, shadow)
{

    var table = $("#lobby_list");
    var includingHtml = "";
    for (var i = 0; i < data.length; ++i)
    {
        includingHtml += "<a id='" + data[i].id + "' class='row data_cell table_href' href='ask_name.html'>";
        includingHtml += "<span class='column first_column left'>" + data[i].name + "</span>";
        includingHtml += "<span class='column second_column left'>" + (data[i].state ? "В игре" : "Игра не началась") + "</span>";
        includingHtml += "<span class='column third_column left'>" + data[i].connectedUserCount + "/" + data[i].maxUserCount + "</span>";
        includingHtml += "</a>";
    }

    table.find(".data_cell").remove();
    table.find(".free").before(includingHtml);

    shadow.setHandlers($(".table_href"));

    $(".table_href").each(function()
    {
        var currEl = $(this);
        currEl.attr("locked", true);
        currEl.on("click", function()
        {
            socket.emit("gameChosen", currEl.attr("id"));
        });
    });
}