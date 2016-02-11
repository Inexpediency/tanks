/**
 * Created by Vasiliy on 2/2/2016.
 */
function FireSpeedBonus()
{
    this.img = new Image();
    this.img.src =  FIRE_SPEED_BONUS_ADDRESS;
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