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
var START_SCREEN_ADDRESS = "img/start_screen_background.jpg";
var PLAY_TEXT_ADDRESS = "img/play_text.png";
var PLAY_TEXT_ADDRESS_HOVER = "img/play_text_hover.png";
var PLAY_TEXT_X = 1199;
var PLAY_TEXT_Y = 496;
var FPS = 35;
var DELAY = 1000 / FPS;

var BANG_TIME = 20;
var SPARK_ADDRESS = "./img/spark.png";
var LAST_X_SPARK_STATE = 7;
var LAST_Y_SPARK_STATE = 5;
var SPARK_SPEED = 10;
var ACCELERATION = 2;

//speed делитель SQUARE_SIZE / 2
//rotateTowerSpeed делитель 90
var PLAYER_CONSTS = {
    towerImgAddres: "img/tower_p.png",
    bodyImageAddres: "img/body_p.png",
    rotateTowerSpeed: 6,
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
    speedNormal: 4,
    speedPatrol: 4,
    health: 2,
    reloadingTime: 47,
    foundRadius: 10
};

var SPRINT_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.gif",
    rotateTowerSpeed: 10,
    speedNormal: 8,
    speedPatrol: 8,
    health: 1,
    reloadingTime: 40,
    foundRadius: 10
};

var ARMOR_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.gif",
    rotateTowerSpeed: 5,
    speedNormal: 2,
    speedPatrol: 2,
    health: 3,
    reloadingTime: 50,
    foundRadius: 12
};

var SQUARE_SIZE = 64;