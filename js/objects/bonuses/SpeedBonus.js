/**
 * Created by Vasiliy on 2/2/2016.
 */
function SpeedBonus()
{
    this.img = new Image();
    this.img.src = SPEED_BONUS_ADDRESS;
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