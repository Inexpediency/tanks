/**
 * Created by Vasiliy on 2/2/2016.
 */
function TowerSpeedBonus()
{
    var constants = require("../../common/constants.js").constants;
    this.character = constants.TOWER_SPEED_BONUS_CHAR;
    this.maxStageX = 3;
    this.maxStageY = 3;
    this.dropeChance = 30;
    this.width = 32;
    this.height = 32;

    this.upgrade = function(tank)
    {
        tank.rotateTowerSpeed = tank.commonFunctionObj.nextDivider(tank.rotateTowerSpeed, 90);
    };
}

module.exports = TowerSpeedBonus;