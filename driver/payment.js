import drivers from "../config/drivers";
import { apply as azeriCardApply } from "../services/azericard.js";
import { approve as azeriCardApprove } from "../services/azericard.js";

export class Payment{
    driver = '';

    apply(){
        switch (this.driver){
            case drivers.AZERICARD: {
                return azeriCardApply().then(res => {
                    return res;
                })
            }
        }
    }
    approve(){
        switch (this.driver){
            case drivers.AZERICARD: {
                azeriCardApprove()
                break;
            }
        }
    }
}