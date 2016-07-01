/**
 * Created by Vasiliy on 2/2/2016.
 */
function HealthBonus()
{
    var constants = require("../../common/constants.js").constants;
    this.character = constants.HEALTH_BONUS_CHAR;
    this.maxStageX = 3;
    this.maxStageY = 3;
    this.dropeChance = 80;
    this.width = 32;
    this.height = 32;
    this.upgrade = function(tank)
    {
        tank.health++;
    };
}

module.exports = HealthBonus;