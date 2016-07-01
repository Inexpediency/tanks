/**
 * Created by Vasiliy on 6/21/2016.
 */
$(window).ready(function()
{

    var shadow = new ShadowMaker();
    var userData = checkSessionData(shadow);
    var socket = io();
    socket.emit("userConnect", userData);
    initHartBeat(socket);

    socket.emit("startDialog", userData);
    initControlKey(socket);

    socket.on("gameNotStart", function()
    {
        shadow.goToHref("lobby.html");
    });

    var fieldDrawer = new FieldDrawer(document.getElementById("gameField"));
    initHealthBlock();
    socket.on("gameField", function(gameField)
    {
        fieldDrawer.draw(gameField);
        setTime(gameField.time);
        var tank = getTankById(gameField.tanks, userData.userId);
        drawPlayerHealth(tank.health);
    });

    socket.on("tanksChart", function(tanks)
    {
        fillTankTable(tanks);
        fillTankTable(tanks);
    });

    socket.on("endGame", function()
    {
        showResultTable();
    });

    $(window).unload(function()
    {
        socket.emit("userDisconnected", userData);
    });
});

function showResultTable()
{
    $(window).off("keyup keydown");
    $("#tanks_chart").css("display", "block");
    $("#lobby").css("display", "block");
}

function getTankById(arr, id)
{
    for (var i = 0; i < arr.length; ++i)
    {
        if (id == arr[i].userId)
        {
            return arr[i];
        }
    }
    return null;
}

function setTime(time)
{
    time = parseInt(time / 1000);
    var seconds = time % 60 >= 10 ? time % 60 : "0" + time % 60;
    $("#time").html(parseInt(time / 60) + ":" + seconds);
}

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

function fillTankTable(tanks)
{
    var table = $("#tanks_chart");
    var includingHtml = "";
    sortBy("killing", tanks);
    for (var i = 0; i < tanks.length; ++i)
    {
        includingHtml += "<span class='row data_cell table_href'>";
        includingHtml += "  <span class='column first_column left'>" + (tanks[i].name == "" ? "<pre> </pre>" : tanks[i].name) + "</span>";
        includingHtml += "  <span class='column second_column left'>" + tanks[i].killing + "</span>";
        includingHtml += "  <span class='column third_column left'>" + tanks[i].death + "</span>";
        includingHtml += "</span>";
    }
    table.find(".data_cell").remove();
    table.find(".free").before(includingHtml);
}

function sortBy(propertis, arr)
{
    for (var i = 0; i < arr.length; ++i)
    {
        for (var j = 1; j < arr.length - i; ++j)
        {
            if (arr[j - 1][propertis] < arr[j][propertis])
            {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
}

function drawPlayerHealth(health)
{
    var healthBlock = $("#health");
    healthBlock.html("");
    if (health > MAX_VISIBLE_HEALTH)
    {
        var healthImg = new Image();
        healthImg.src = HEALTH_ADDRESS;
        healthBlock.append(healthImg, " x" + health);
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
}

function initControlKey(socket)
{
    $(window).keydown(function(event)
    {
        var eventType = "";
        var data = null;
        switch (event.which)
        {
            case TOWER_UP:
                eventType = "moveTankHead";
                data = UP_CHAR; //up
                break;
            case TOWER_DOWN:
                eventType = "moveTankHead";
                data = DOWN_CHAR; //down
                break;
            case TOWER_LEFT:
                eventType = "moveTankHead";
                data = LEFT_CHAR; //left
                break;
            case TOWER_RIGHT:
                eventType = "moveTankHead";
                data = RIGHT_CHAR; //right
                break;
            case FIRE:
                eventType = "fire";
                data = true;
                break;
            case UP:
                eventType = "moveTank";
                data = UP_CHAR;
                break;
            case DOWN:
                eventType = "moveTank";
                data = DOWN_CHAR;
                break;
            case LEFT:
                eventType = "moveTank";
                data = LEFT_CHAR;
                break;
            case RIGHT:
                eventType = "moveTank";
                data = RIGHT_CHAR;
                break;
            case SHOW_CHART:
                $("#tanks_chart").css("display", "block");
        }
        if (eventType != "")
        {
            socket.emit(eventType, data);
        }
    });

    $(window).keyup(function(event)
    {
        var key = event.which;
        var motion = "";
        if (key == DOWN)
        {
            motion = DOWN_CHAR;
        }
        else if (key == LEFT)
        {
            motion = LEFT_CHAR;
        }
        else if (key == UP)
        {
            motion = UP_CHAR;
        }
        else if (key == RIGHT)
        {
            motion = RIGHT_CHAR;
        }
        if (key == SHOW_CHART)
        {
            console.log("up");
            $("#tanks_chart").css("display", "none");
        }
        if (motion != "")
        {
            socket.emit("stopTank", motion);
        }
    });
}