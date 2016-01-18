/**
 * Created by Vasiliy on 1/6/2016.
 */
function Bang(x, y)
{
    var commonFunctionObj = new CommonFunctionObj();

    this.x = x;
    this.y = y;
    this.liveTime = BANG_TIME;
    this.speedX = 0;
    this.speedY = 0;
    this.fireRadius = (SQUARE_SIZE - SQUARE_SIZE % 12) / 12;
    this.fireParticles = [];
    this.sparkImg = new Image();
    this.sparkImg.src = SPARK_ADDRESS;

    this.move = function()
    {
        for (var i = 0; i < this.liveTime; ++i)
        {
            var finalX = commonFunctionObj.randNumb(-this.fireRadius, this.fireRadius);
            var finalY = commonFunctionObj.randSign() * Math.sqrt(this.fireRadius * this.fireRadius - finalX * finalX);
            var startX = this.x * SQUARE_SIZE + (SQUARE_SIZE - SQUARE_SIZE % 2) / 2;
            var startY = this.y * SQUARE_SIZE + (SQUARE_SIZE - SQUARE_SIZE % 2) / 2;
            this.fireParticles[this.fireParticles.length] = new DynamicParticle(this.sparkImg, startX, startY,
                finalX / SPARK_SPEED, finalY / SPARK_SPEED,
                LAST_X_SPARK_STATE, LAST_Y_SPARK_STATE,
                SQUARE_SIZE / 3, SQUARE_SIZE / 3);
        }
        commonFunctionObj.moveArrObj(this.fireParticles);
        this.liveTime--;
        if (this.liveTime <= 0 && this.fireParticles.length == 0)
        {
            return 1;
        }
        return 0;
    };

    this.draw = function()
    {
        for (var i = this.fireParticles.length - 1; i >= 0; --i)
        {
            this.fireParticles[i].draw()
        }
    };
}