/**
 * Created by Vasiliy on 2/2/2016.
 */
function FireSpeedBonus()
{
    var constants = require("../../common/constants.js").constants;
    this.character = constants.FIRE_SPEED_BONUS_CHAR;
    this.maxStageX = 3;
    this.maxStageY = 3;
    this.dropeChance = 40;
    this.width = 32;
    this.height = 32;

    this.upgrade = function(tank)
    {
        tank.reloadingTime = tank.reloadingTime > 0 ? (tank.reloadingTime - 3) : 0;
    };
}

module.exports = FireSpeedBonus;