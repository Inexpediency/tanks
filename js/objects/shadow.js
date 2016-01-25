/**
 * Created by Vasiliy on 1/18/2016.
 */
function Shadow()
{
    this.img = new Image();
    this.img.src = SHADOW_ADDRESS;
    this.level = SHADOW_LEVEL;
    this.canvas = document.getElementById("context");
    this.ctx = this.canvas.getContext("2d");

    this.drawShadow = function(step)
    {
        this.level = this.level + step;
        for (var i = 0; i < this.level; ++i)
        {
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}