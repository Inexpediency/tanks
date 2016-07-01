var LEFT_CHAR = "l";
var DOWN_CHAR = "d";
var RIGHT_CHAR = "r";
var UP_CHAR = "u";

var REFRESH_GAME_STATE_DELAY = 23;
var MAX_PLAYERS_COUNT = 10;

var MAX_VISIBLE_HEALTH = 3;

var FIELD_X_SIZE = 20;
var FIELD_Y_SIZE = 12;

var BARRICADE_CHAR = "b";
var NOTHING_CHAR = "o";
var TRAVELED_BARRICADE_CHAR = "r";
var HEALTH_BONUS_CHAR = "h";
var FIRE_SPEED_BONUS_CHAR = "f";
var SPEED_BONUS_CHAR = "s";
var TOWER_SPEED_BONUS_CHAR = "t";

var SMOKE_COUNT = 2;
var DUST_COUNT = 60;
var LAST_X_SMOKE_STATE = 7;
var LAST_Y_SMOKE_STATE = 4;
var LAST_X_DUST_STATE = 2;
var LAST_Y_DUST_STATE = 2;

var BANG_SOUND_ADDRESS = "bang.mp3";
var HEALTH_BONUS_ADDRESS = "health_bonus.png";
var SPEED_BONUS_ADDRESS = "speed_bonus.png";
var TOWER_SPEED_BONUS_ADDRESS = "tower_rotate_bonus.png";
var FIRE_SPEED_BONUS_ADDRESS = "fire_speed_bonus.png";

var BANG_ADDRESS = "spark.png";
var SMOKE_ADDRESS = "smoke.png";
var DUST_ADDRESS = "dust.png";
var BALL_ADDRESS = "ball.png";
var TANK_BODY_ADDRESS = "tank_body.png";
var TANK_TOWER_ADDRESS = "tower_e.png";


var BARRICADE_ADDRESS = "barricade.png";
var TRAVELED_BARRICADE_ADDRESS = "traveld_barricade.png";

var HEALTH_ADDRESS = "health.png";

var CLIENT_LIVE_TIME = 3000;
var REQUEST_TIME = 10;

var ELEMENT_SIZE = 60;

if (typeof module !== "undefined" && module.exports)
{
    module.exports.constants = {
        LEFT_CHAR: LEFT_CHAR,
        DOWN_CHAR: DOWN_CHAR,
        RIGHT_CHAR: RIGHT_CHAR,
        UP_CHAR: UP_CHAR,
        FIELD_X_SIZE: FIELD_X_SIZE,
        FIELD_Y_SIZE: FIELD_Y_SIZE,
        BARRICADE_CHAR: BARRICADE_CHAR,
        NOTHING_CHAR: NOTHING_CHAR,
        REFRESH_GAME_STATE_DELAY: REFRESH_GAME_STATE_DELAY,
        CLIENT_LIVE_TIME: CLIENT_LIVE_TIME, //m_seconds
        TRAVELED_BARRICADE_CHAR: TRAVELED_BARRICADE_CHAR,
        MAX_PLAYERS_COUNT: MAX_PLAYERS_COUNT,
        ELEMENT_SIZE: ELEMENT_SIZE,
        BALL_SPEED: 25,
        MAX_BONUS_COUNT: 10,
        GAME_DELAY: 32,
        BARRICADE_HEALTH: 2,
        HEALTH_BONUS_CHAR: HEALTH_BONUS_CHAR,
        FIRE_SPEED_BONUS_CHAR: FIRE_SPEED_BONUS_CHAR,
        SPEED_BONUS_CHAR: SPEED_BONUS_CHAR,
        TOWER_SPEED_BONUS_CHAR: TOWER_SPEED_BONUS_CHAR,
        GAME_TIMER: 1200000,
        BALL_HEALTH: 1
    };
}