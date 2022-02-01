import drivers from "../config/drivers";
import { apply as azeriCardApply } from "../services/azericard.js";
import { approve as azeriCardApprove } from "../services/azericard.js";

export class Payment{
    driver = '';

    async apply(){
        switch (this.driver){
            case drivers.AZERICARD: {
                return await azeriCardApply().then(res => {
                    return res;
                })
            }
        }
    }
    async approve(){
        switch (this.driver){
            case drivers.AZERICARD: {
                return await azeriCardApprove().then(res =>{
                    return res;
                })
            }
        }
    }
}