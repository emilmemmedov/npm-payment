require('dotenv/config')
const axios = require('axios');

const drivers = ['AzeriCart'];
let driverName = ''
const type = {
    auth: 1,
    checkout: 21
}
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
function convertToBinary(nMask) {
    // nMask must be between -2147483648 and 2147483647
    if (nMask > 2**31-1)
        throw "number too large. number shouldn't be > 2**31-1"; //added
    if (nMask < -1*(2**31))
        throw "number too far negative, number shouldn't be < 2**31" //added
    for (var nFlag = 0, nShifted = nMask, sMask = ''; nFlag < 32;
         nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    sMask=sMask.replace(/\B(?=(.{8})+(?!.))/g, "") // added
    return sMask;
}

function randomMd5(min,max) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = min; i < max; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
function getUtcTime(){
    return date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
}

function getLengthItem(item){
    return item.toString().length + '' + item.toString().length;
}

function chr(n) {
    if (n < 128) {
        return String.fromCharCode(n);
    } else {
        return "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "[n - 128];
    }
}
function hexdec(hexString){
    hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
    return parseInt(hexString, 16)
}

function replace(str, start, end, newStr) {
    return str.substr(0, start) + newStr + str.substr(end);
}

function hex2bin(hexdata) {
    let bindata = "";

    for (let i=0; i < hexdata.toString().length; i+=2) {
        bindata += chr(hexdec(hexdata.toString().substr(i,2)));
    }

    return $bindata;
}

function applyForAzericart(data, backref){
    console.log(data);
    const url = process.env.AZERICARD_URL;
    const currency = process.env.CURRENCY;
    const companyName = process.env.COMPANY_NAME;
    const returningUrl = process.env.RETURNING_URL;
    const terminal = process.env.TERMINAL;
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL;

    if (!url){
        throw Error('please add Azeri card URL to .env file');
    }
    else{
        const request = {
            'AMOUNT': data.amount,
            'CURRENCY': currency,
            'ORDER': convertToBinary(data.id),
            'DESC': 'Description of the sale',
            'MERCH_NAME': companyName,
            'MERCH_URL': returningUrl,
            'TERMINAL': terminal,			// That is your personal ID in payment system
            'EMAIL': companyName,
            'TRTYPE': type.auth,				// That is the type of operation, 1 - Authorization and checkout
            'COUNTRY': 'AZ',
            'MERCH_GMT': "+4",
            'BACKREF': backref,
            'NONCE': randomMd5(0,16),
            'TIMESTAMP':getUtcTime(),
            'LANG': 'AZ'
        }
        const to_sign = ''
            + getLengthItem(request['AMOUNT'])
            + getLengthItem(request['CURRENCY'])
            + getLengthItem(request['ORDER'])
            + getLengthItem(request['DESC'])
            + getLengthItem(request['MERCH_NAME'])
            + getLengthItem(request['MERCH_URL'])
            + getLengthItem(request['TERMINAL'])
            + getLengthItem(request['EMAIL'])
            + getLengthItem(request['TRTYPE'])
            + getLengthItem(request['COUNTRY'])
            + getLengthItem(request['MERCH_GMT'])
            + getLengthItem(request['TIMESTAMP'])
            + getLengthItem(request['NONCE'])
            + getLengthItem(request['BACKREF'])

        let keyForSignIn = process.env.KEY_FOR_SIGN_IN;
        let p_sign = 'f'
        // axios.post(process.env.AZERICARD_URL)
    }
}

module.exports = {
    driver: driver,
    apply: apply
}