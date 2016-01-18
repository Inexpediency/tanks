/**
 * Created by Vasiliy on 11/25/2015.
 */
function parseQueryString()
{
    var qweryStr = window.location.href;
    var isPropName = 1;
    var prop = "";
    var propName = "";
    var result = {};
    for (var i = qweryStr.indexOf("?") + 1; i < qweryStr.length; ++i)
    {
        if (qweryStr[i] == "=")
        {
            isPropName = 0;
        }
        else if (qweryStr[i] == "&")
        {
            isPropName = 1;
            result[propName] = prop;
            propName = "";
            prop = "";
        }
        else if (qweryStr[i] != " ")
        {
            if (isPropName)
            {
                propName += qweryStr[i];
            }
            else
            {
                prop += qweryStr[i];
            }
        }
    }
    return result;
}