const drivers = require("../config/drivers");
const {apply: azeriCardApply, approve: azeriCardApprove} = require("../services/azericard.js");

class Payment{
    driver = '';

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

module.exports = {
    Payment
}