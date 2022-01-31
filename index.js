require('dotenv/config')

const drivers = ['AzeriCart'];
let driverName = ''

function driver(driver) {
    if (!drivers.includes(driver)){
        throw new Error('driver not found')
    }
    else{
        driverName = driver;
    }
}

function apply(data){
    switch (driverName){
        case "AzeriCart": {
            applyForAzericart(data);
        }
    }
}

function applyForAzericart(data){
    if (!process.env.AZERICARD_URL){
        throw Error('please add Azeri card URL to .env file');
    }
    else{

    }
}

module.exports = {
    driver: driver,
    apply: apply
}