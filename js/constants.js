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

var LEFT_CHAR = "l";
var DOWN_CHAR = "d";
var RIGHT_CHAR = "r";
var UP_CHAR = "u";

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

var SHADOW_LEVEL = 43;

var SPARK_ADDRESS = "./img/spark.png";
var SMOKE_ADDRESS = "./img/smoke.png";
var DUST_ADDRESS = "./img/dust.png";
var BALL_ADDRESS = "./img/ball.png"
var BARRICADE_ADDRESS = "./img/barricade.png";
var TRAVELED_BARRICADE_ADDRESS = "./img/traveld_barricade.png";
var HEALTH_ADDRES = "./img/health.png";
var RESULT_SCREEN_ADDRESS = "result_screen.html"
var START_SCREEN_ADDRESS = "start_screen.html";
var SHADOW_ADDRESS = "img/shadow.png";
var PLAY_BUTTON_ADDRESS = "img/next_button.png";
var PLAY_BUTTON_ADDRESS_HOVER = "img/next_button_hover.png";
var PLAY_BUTTON_ADDRESS_CLICK = "img/next_button_click.png";
var PAUSE_BUTTON_ADDRESS = "img/pause_button.png";
var PAUSE_BUTTON_ADDRESS_HOVER = "img/pause_button_hover.png";
var PAUSE_BUTTON_ADDRESS_CLICK = "img/pause_button_click.png";

var FPS = 30;
var DELAY = 1000 / FPS;
var BANG_TIME = 13;
var LAST_X_SPARK_STATE = 7;
var LAST_Y_SPARK_STATE = 5;
var LAST_X_SMOKE_STATE = 7;
var LAST_Y_SMOKE_STATE = 4;
var LAST_X_DUST_STATE = 2;
var LAST_Y_DUST_STATE = 2;
var SPARK_SPEED = 10;
var SMOKE_COUNT = 2;
var DUST_COUNT = 60;

//speed делитель SQUARE_SIZE / 2
//rotateTowerSpeed делитель 90
var PLAYER_CONSTS = {
    towerImgAddres: "img/tower_p.png",
    bodyImageAddres: "img/body_p.png",
    rotateTowerSpeed: 9,
    speedNormal: 3,
    speedPatrol: 3,
    health: 6,
    reloadingTime: 40,
    foundRadius: 10
};

var ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.png",
    rotateTowerSpeed: 6,
    speedNormal: 2,
    speedPatrol: 2,
    health: 4,
    reloadingTime: 47,
    foundRadius: 10
};

var SPRINT_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.png",
    rotateTowerSpeed: 6,
    speedNormal: 3,
    speedPatrol: 3,
    health: 3,
    reloadingTime: 40,
    foundRadius: 10
};

var ARMOR_ENEMY_CONSTS = {
    towerImgAddres: "img/tower_e.png",
    bodyImageAddres: "img/tank_body.png",
    rotateTowerSpeed: 5,
    speedNormal: 1,
    speedPatrol: 1,
    health: 5,
    reloadingTime: 50,
    foundRadius: 12
};

var SQUARE_SIZE = 2 * 3 * 5 * 2;