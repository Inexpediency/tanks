/**
 * Created by Vasiliy on 6/20/2016.
 */

function checkSessionData(shadow)
{
    var userData = $.parseJSON(window.sessionStorage.getItem("userData"));
    if (userData == null)
    {
        shadow.goToHref("lobby_screen.html");
    }
    return userData;
}