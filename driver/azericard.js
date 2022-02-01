import {Payment} from "./payment.js";
import drivers from "../config/drivers.js";

export class Azericard extends Payment{

    constructor() {
        super();
        super.driver = drivers.AZERICARD;
    }
}