/**
 * Created by Vasiliy on 2/9/2016.
 */
function Barricade(x, y, health, character)
{
    var constants = require("../common/constants.js").constants;
    this.x = x * constants.ELEMENT_SIZE + 0.5 * constants.ELEMENT_SIZE;
    this.y = y * constants.ELEMENT_SIZE + 0.5 * constants.ELEMENT_SIZE;
    this.width = constants.ELEMENT_SIZE;
    this.height = constants.ELEMENT_SIZE;
    this.angle = 0;
    this.character = character;
    this.health = health;
    return this;
}

module.exports = Barricade;