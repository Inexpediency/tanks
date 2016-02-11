/**
 * Created by Vasiliy on 2/2/2016.
 */
function TowerSpeedBonus()
{
    this.img = new Image();
    this.img.src = TOWER_SPEED_BONUS_ADDRESS;
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