/**
 * Created by Vasiliy on 6/20/2016.
 */

function initHartBeat(socket, delay)
{
    setTimeout(function hartBeat()
    {
        socket.emit("hartBeat");
        setTimeout(hartBeat, CLIENT_LIVE_TIME - REQUEST_TIME);
    }, delay);
}

function checkSessionData(shadow)
{
    var userData = $.parseJSON(window.sessionStorage.getItem("userData"));
    if (userData == null)
    {
        shadow.goToHref("lobby_screen.html");
    }
    return userData;
}