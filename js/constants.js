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



var ACCELERATION = 2;

var GRID_COLOR = "#000000";

var SHADOW_LEVEL = 45;

var VIN_MESSAGE = "Победа!";
var lOSE_MESSAGE = "Поражение...";
var HEADER_RESULT_FONT = "40px Segoe UI Black";
var HEADER_RESULT_COLOR = "#333333";
var HEADER_RESULT_PADDING_TOP = 50 + 40;//отступ + высота текста

var BACKGROUND_ADDRESS = "img/background.png";
var START_SCREEN_ADDRESS = "img/start_screen_background.jpg";
var END_LEVEL_BACKGROUND = "img/end_level_background.jpg";
var SPARK_ADDRESS = "./img/spark.png";
var PLAY_TEXT_ADDRESS = "img/play_text.png";
var PLAY_TEXT_ADDRESS_HOVER = "img/play_text_hover.png";
var END_LEVEL_TEXT_ADDRESS = "img/end_level_text.png";
var END_LEVEL_TEXT_ADDRESS_HOVER = "img/end_level_text_hover.png";
var SHADOW_ADDRESS = "img/shadow.png";

var PLAY_TEXT_X = 28;
var PLAY_TEXT_Y = 32;

var FPS = 35;
var DELAY = 1000 / FPS;
var BANG_TIME = 20;
var LAST_X_SPARK_STATE = 7;
var LAST_Y_SPARK_STATE = 5;
var SPARK_SPEED = 10;

//speed делитель SQUARE_SIZE / 2
//rotateTowerSpeed делитель 90
var PLAYER_CONSTS = {
    towerImgAddres: "img/tower_p.png",
    bodyImageAddres: "img/body_p.png",
    rotateTowerSpeed: 9,
    speedNormal: 4,
    speedPatrol: 4,
    health: 3,
    reloadingTime: 40,
    foundRadius: 10
};

var ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.gif",
    rotateTowerSpeed: 10,
    speedNormal: 2,
    speedPatrol: 2,
    health: 2,
    reloadingTime: 47,
    foundRadius: 10
};

var SPRINT_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.gif",
    rotateTowerSpeed: 10,
    speedNormal: 4,
    speedPatrol: 4,
    health: 1,
    reloadingTime: 40,
    foundRadius: 10
};

var ARMOR_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.gif",
    rotateTowerSpeed: 5,
    speedNormal: 1,
    speedPatrol: 1,
    health: 3,
    reloadingTime: 50,
    foundRadius: 12
};

var SQUARE_SIZE = 64;