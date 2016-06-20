var WAIT = 4;
var DISCONNECT = 5;
var FIELD_SIZE = 800;
var MAX_PLAYERS_COUNT = 10;

if (typeof module !== "undefined" && module.exports)
{
    module.exports.constants = {
        FIELD_SIZE: FIELD_SIZE,
        WAIT: WAIT,
        DISCONNECT: DISCONNECT,
        MAX_PLAYERS_COUNT: MAX_PLAYERS_COUNT,
    };
}