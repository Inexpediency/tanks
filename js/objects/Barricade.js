/**
 * Created by Vasiliy on 2/9/2016.
 */
function Barricade(x, y, img, character)
{
    this.commonFunctionObj = new CommonFunctionObj();

    this.x = x + 0.5 * SQUARE_SIZE;
    this.y = y + 0.5 * SQUARE_SIZE;
    this.width = SQUARE_SIZE;
    this.height = SQUARE_SIZE;
    this.angle = 0;//this.commonFunctionObj.randNumb(0, 359);
    this.character = character;

    this.draw = function()
    {
        this.commonFunctionObj.drawRotatedObj(this.angle, img, this.x,
            this.y, SQUARE_SIZE, SQUARE_SIZE, 0);
    };
}