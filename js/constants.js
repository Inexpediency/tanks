/**
 * Created by Vasiliy on 9/30/2015.
 */
var TOWER_LEFT = 37;
var TOWER_UP = 38;
var TOWER_RIGHT = 39;
var TOWER_DOWN = 40;

var FIRE = 32;
var LEFT = 65;
var UP = 87;
var RIGHT = 68;
var DOWN = 83;

var PLAYER_CHAR = "y";
var ENEMY_CHAR = "e";
var SPRINT_ENEMY_CHAR = "s";
var ARMOR_ENEMY_CHAR = "a";
var BARRICADE_CHAR = "b";
var BALL_CHAR = "f";
var NOTHING_CHAR = "0";
var TRAVELED_BARRICADE_CHAR = "r";

var GRID_COLOR = "#435366";
var BACKGROUND_ADDRESS = "img/background.png";
var TOWER_PLAYER_ADDRES = "img/tower_p.png";
var TOWER_ENEMY_ADDRES = "img/tower_e.png";
var TANK_BODY_ADDRES = "img/tank_body.gif";

var FPS = 33;
var DELAY = 1000 / FPS;

var BANG_TIME = 20;
var SPARK_ADDRESS = "./img/spark.png";
var LAST_X_SPARK_STATE = 7;
var LAST_Y_SPARK_STATE = 5;
var SPARK_SPEED = 10;
var ACCELERATION = 2;

//speed делитель SQUARE_SIZE / 2
var PLAYER_CONSTS = {
    rotateTowerSpeed: 6,
    speedNormal: 8,
    speedPatrol: 8,
    health: 3,
    reloadingTime: 10,
    foundRadius: 10
};

var ENEMY_CONSTS = {
    rotateTowerSpeed: 10,
    speedNormal: 8,
    speedPatrol: 4,
    health: 2,
    reloadingTime: 12,
    foundRadius: 10
};

var SPRINT_ENEMY_CONSTS = {
    rotateTowerSpeed: 10,
    speedNormal: 16,
    speedPatrol: 8,
    health: 1,
    reloadingTime: 10,
    foundRadius: 10
};

var ARMOR_ENEMY_CONSTS = {
    rotateTowerSpeed: 5,
    speedNormal: 4,
    speedPatrol: 2,
    health: 3,
    reloadingTime: 14,
    foundRadius: 12
};

var SQUARE_SIZE = 64;