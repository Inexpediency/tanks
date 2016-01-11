/**
 * Created by Vasiliy on 1/6/2016.
 */
function DynamicParticle(img, x, y, SpeedX, SpeedY, lastX, lastY, width, height)
{
    this.x = x;
    this.y = y;
    this.speedY = SpeedY;
    this.speedX = SpeedX;
    this.stateX = 0;
    this.stateY = 0;
    this.sparkWidth = img.width / (lastX + 1);
    this.sparkHeight = img.height / (lastY + 1);
    this.move = function()
    {
        this.x += this.speedX;
        this.y += this.speedY;
        this.stateX++;
        if (this.stateX > lastX)
        {
            this.stateX = 0;
            this.stateY++;
            if (this.stateY > lastY)
            {
                return 1;
            }
        }
        return 0;
    };
    this.draw = function()
    {
        g_ctx.drawImage(
            img,
            this.sparkWidth * this.stateX,
            this.sparkHeight * this.stateY, this.sparkWidth, this.sparkHeight,
            this.x - width / 2, this.y - height / 2,
            width, height);
    };
}