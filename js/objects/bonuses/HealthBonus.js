/**
 * Created by Vasiliy on 2/2/2016.
 */
function HealthBonus()
{
    this.img = new Image();
    this.img.src =  HEALTH_BONUS_ADDRESS;
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