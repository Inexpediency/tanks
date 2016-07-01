/**
 * Created by Vasiliy on 2/2/2016.
 */
function SpeedBonus()
{
    var constants = require("../../common/constants.js").constants;
    this.character = constants.SPEED_BONUS_CHAR;
    this.maxStageX = 3;
    this.maxStageY = 3;
    this.dropeChance = 30;
    this.width = 32;
    this.height = 32;

    this.upgrade = function(tank)
    {
        tank.speed++;
        tank.rotateSpeed = tank.commonFunctionObj.translateDividers(tank.speed, 90);
    };
}

module.exports = SpeedBonus;

