/**
 * Created by Vasiliy on 2/9/2016.
 */
function Barricade(x, y, img, character)
{
    this.commonFunctionObj = new CommonFunctionObj();

    this.x = x;
    this.y = y;
    this.angle = this.commonFunctionObj.randNumb(0, 366);
    this.character = character;

    this.draw = function()
    {
        this.commonFunctionObj.drawRotatedObj(this.angle, img, this.x + 0.5 * SQUARE_SIZE,
            this.y + 0.5 * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, 0);
    };
}