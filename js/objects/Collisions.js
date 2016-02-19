/**
 * Created by Vasiliy on 2/15/2016.
 */
function Collisions()
{
    this.getIntersection = function(obj1, obj2)
    {
        var xIntersection = ((obj1.x + obj1.width / 2) > (obj2.x - obj2.width / 2)) &&
                            ((obj2.x + obj2.width / 2) > (obj1.x - obj1.width / 2));
        var yIntersection = ((obj1.y + obj1.height / 2) > (obj2.y - obj2.height / 2)) &&
                            ((obj2.y + obj2.height / 2) > (obj1.y - obj1.height / 2));
        return xIntersection && yIntersection && (obj1.x != obj2.x || obj1.y != obj2.y);
    };

    this.getIntersectedObj = function(obj, arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            if (this.getIntersection(obj, arr[i]))
            {
                return arr[i];
            }
        }
        return null;
    };

    this.isIntersectedObj = function(obj, arr)
    {
        for (var i = 0; i < arr.length; ++i)
        {
            if (this.getIntersection(obj, arr[i]))
            {
                return 1;
            }
        }
        return 0;
    };
}