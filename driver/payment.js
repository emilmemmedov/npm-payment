import drivers from "../config/drivers";
import { apply as azeriCardApply } from "../services/azericard.js";
import { approve as azeriCardApprove } from "../services/azericard.js";

export class Payment{
    private driver = '';

    async apply(data, backRef){
        switch (this.driver){
            case drivers.AZERICARD: {
                return await azeriCardApply(data, backRef).then(res => {
                    return res;
                })
            }
        }
    }
    async approve(data){
        switch (this.driver){
            case drivers.AZERICARD: {
                return await azeriCardApprove(data).then(res =>{
                    return res;
                })
            }
        }
    }
}