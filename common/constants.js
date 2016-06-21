var LEFT_CHAR = "l";
var DOWN_CHAR = "d";
var RIGHT_CHAR = "r";
var UP_CHAR = "u";
var MAX_PLAYERS_COUNT = 10;
var MAX_VISIBLE_HEALTH = 3;
var HEALTH_ADDRESS = "health.png";

if (typeof module !== "undefined" && module.exports)
{
    module.exports.constants = {
        LEFT_CHAR: LEFT_CHAR,
        DOWN_CHAR: DOWN_CHAR,
        RIGHT_CHAR: RIGHT_CHAR,
        UP_CHAR: UP_CHAR,
        MAX_PLAYERS_COUNT: MAX_PLAYERS_COUNT,
    };
}