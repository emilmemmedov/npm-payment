const {Payment} = require("./payment.js");
const drivers = require("../config/drivers.js")

class Azericard extends Payment{

    constructor() {
        super();
        super.driver = drivers.AZERICARD;
    }
}
module.exports = {
    Azericard
}