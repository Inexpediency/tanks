/**
 * Created by Vasiliy on 1/11/2016.
 */
function Game(level)
{
    var arrController = new CommonFunctionObj();

    this.field = new Field(level);
    this.paused = 0;
    this.isShadowVisible = 1;
    this.shadowStep = -1;
    this.isGameEnd = 0;
    this.shadow = new Shadow();

    var game = this;
    this.tick = function()
    {
        if (game.isShadowVisible)
        {
            $("body").css("display", "block");
            arrController.moveArrObj(game.field.bangs);
            game.field.draw();
            game.shadow.ctx.clearRect(0, 0, game.shadow.canvas.width, game.shadow.canvas.height);
            game.shadow.drawShadow(game.shadowStep);
            if (game.shadow.level == 0 ||
                game.shadow.level == SHADOW_LEVEL)
            {
                if (game.shadow.level == 0)
                {
                    game.shadow.canvas.style.width = "0";
                }
                game.isShadowVisible = 0;
            }
        }
        else if (!game.paused)
        {
            game.field.move();
            game.field.draw();
        }
        var playerNumb = arrController.findTank(game.field.players, PLAYER_CHAR);
        if ((playerNumb == undefined ||
            game.field.players[playerNumb + 1]  == undefined &&
            game.field.players[playerNumb - 1]  == undefined) && game.shadow.level == 0)
        {
            game.shadow.canvas.style.width = "100%";
            game.isShadowVisible = 1;
            game.shadowStep = 1;
            game.isGameEnd = 1;
        }
        if (game.isGameEnd && !game.isShadowVisible)
        {
            clearInterval(game.intervalId);
            game._showResultScreen();
        }
    };

    this._showResultScreen = function()
    {
        var isWin = +(this.field.player.health > 0);
        window.location = RESULT_SCREEN_ADDRESS + "?isWin=" + isWin + "&currentLevel=" + this.field.currentLevel + "&";
    };

    this.initHealthBlock = function()
    {
        var health = new Image();
        health.src = HEALTH_ADDRES;
        $(health).load(function()
        {
            $("#health").width(health.width * MAX_VISIBLE_HEALTH + "px");
            $("#controlPanel").width(255 + parseInt($("#health").width()) + "px");
        });
    };

    this.initPauseButton = function()
    {
        var pauseButton = $("#pauseButton");
        pauseButton.css("background", "url(\"" + PAUSE_BUTTON_ADDRESS + "\")");
        pauseButton.css("backgroundSize", "cover");
        pauseButton.isPause = 0;
        pauseButton.mouseover(function()
        {
            game._changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS_HOVER, PAUSE_BUTTON_ADDRESS_HOVER);
        });
        pauseButton.mouseout(function()
        {
            game._changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS, PAUSE_BUTTON_ADDRESS);
        });
        pauseButton.mousedown(function()
        {
            if (pauseButton.isPause)
            {
                game.paused = 0;
                pauseButton.css("background", "url(\"" + PAUSE_BUTTON_ADDRESS_CLICK + "\")");
            }
            else
            {
                game.paused = 1;
                pauseButton.css("background", "url(\"" + PLAY_BUTTON_ADDRESS_CLICK + "\")");
            }
            pauseButton.isPause = !pauseButton.isPause;
            pauseButton.css("backgroundSize", "cover");
        });
        pauseButton.mouseup(function()
        {
            game._changeButtonState(pauseButton, PLAY_BUTTON_ADDRESS_HOVER, PAUSE_BUTTON_ADDRESS_HOVER);
        });
    };

    this._changeButtonState = function(button, startAddress, finishAddress)
    {
        if (button.isPause)
        {
            button.css("background", "url(\"" + startAddress + "\")");
        }
        else
        {
            button.css("background", "url(\"" + finishAddress + "\")");
        }
        button.css("backgroundSize", "cover");
    };

    this.initKeys = function(player)
    {
        $(window).keydown(function(event)
        {
            switch (event.which)
            {
                case TOWER_UP:
                    player.towerState =  UP_CHAR; //up
                    break;
                case TOWER_DOWN:
                    player.towerState =  DOWN_CHAR; //down
                    break;
                case TOWER_LEFT:
                    player.towerState =  LEFT_CHAR; //left
                    break;
                case TOWER_RIGHT:
                    player.towerState = RIGHT_CHAR; //right
                    break;
                case FIRE:
                    player.fire = true;
                    break;
                case UP:
                    player.motion = UP_CHAR;
                    player.finalBodeState = UP_CHAR;
                    break;
                case DOWN:
                    player.motion = DOWN_CHAR;
                    player.finalBodeState = DOWN_CHAR;
                    break;
                case LEFT:
                    player.motion = LEFT_CHAR;
                    player.finalBodeState = LEFT_CHAR;
                    break;
                case RIGHT:
                    player.motion = RIGHT_CHAR;
                    player.finalBodeState = RIGHT_CHAR;
                    break;
            }
        });

        $(window).keyup(function(event)
        {
            var key = event.which;
            if (key == DOWN && player.motion == DOWN_CHAR)
            {
                player.motion = NOTHING_CHAR;
            }
            else if (key == LEFT && player.motion == LEFT_CHAR)
            {
                player.motion = NOTHING_CHAR;
            }
            else if (key == UP && player.motion == UP_CHAR)
            {
                player.motion = NOTHING_CHAR;
            }
            else if (key == RIGHT && player.motion == RIGHT_CHAR)
            {
                player.motion = NOTHING_CHAR;
            }
        });
    }

    game.initHealthBlock();
    game.initKeys(game.field.player);
    game.initPauseButton();
    game.intervalId = setInterval(game.tick, DELAY);
}