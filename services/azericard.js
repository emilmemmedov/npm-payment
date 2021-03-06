const crypto = require("crypto");
const axios = require("axios");
require('dotenv/config');

const type = {
    auth: 1,
    checkout: 21
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
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = min; i < max; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
function getUtcTime(){
    let date = new Date();
    return date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
}

function getLengthItem(item){
    return item.toString().length + '' + item.toString();
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
    let binData = "";

    for (let i=0; i < hexdata.toString().length; i+=2) {
        binData += chr(hexdec(hexdata.toString().substr(i,2)));
    }

    return binData;
}

async function apply(data, backRef){
    console.log(data);
    const url = process.env.AZERICARD_URL;
    const currency = process.env.CURRENCY;
    const companyName = process.env.COMPANY_NAME;
    const returningUrl = process.env.RETURNING_URL;
    const terminal = process.env.TERMINAL;
    const companyEmail = process.env.COMPANY_EMAIL;

    if (!url){
        throw Error('please add Azeri card URL to .env file');
    }
    else{
        const params = new URLSearchParams();
        params.append('AMOUNT', data.amount);
        params.append('CURRENCY', currency);
        params.append('ORDER', getUtcTime());
        params.append('DESC', 'Description of the sale');
        params.append('MERCH_NAME', companyName);
        params.append('MERCH_URL', returningUrl);
        params.append('TERMINAL', terminal);
        params.append('EMAIL', companyEmail);
        params.append('TRTYPE', type.auth);
        params.append('COUNTRY', 'AZ');
        params.append('MERCH_GMT', "+4");
        params.append('BACKREF', backRef);
        params.append('NONCE', randomMd5(0,16));
        params.append('TIMESTAMP', getUtcTime());
        params.append('LANG', 'AZ');

        const to_sign = ''
            + getLengthItem(params.get('AMOUNT'))
            + getLengthItem(params.get('CURRENCY'))
            + getLengthItem(params.get('ORDER'))
            + getLengthItem(params.get('DESC'))
            + getLengthItem(params.get('MERCH_NAME'))
            + getLengthItem(params.get('MERCH_URL'))
            + getLengthItem(params.get('TERMINAL'))
            + getLengthItem(params.get('EMAIL'))
            + getLengthItem(params.get('TRTYPE'))
            + getLengthItem(params.get('COUNTRY'))
            + getLengthItem(params.get('MERCH_GMT'))
            + getLengthItem(params.get('TIMESTAMP'))
            + getLengthItem(params.get('NONCE'))
            + getLengthItem(params.get('BACKREF'))

        let keyForSignIn = process.env.KEY_FOR_SIGN_IN;
        params.append('P_SIGN',crypto.createHmac("sha1", hex2bin(keyForSignIn)).update(to_sign).digest('hex').toString('base64'));

        return await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then(response => {
            console.log(response)
            return response;
        }).catch(er=>{
            console.log(er);
        })
    }
}
async function sendForCheckout(url, params){
    // const options = {
    //     CURLOPT_RETURNTRANSFER: true,		// return web page
    //     CURLOPT_HEADER: false,    // don't return headers
    //     CURLOPT_FOLLOWLOCATION: true,     // follow redirects
    //     CURLOPT_ENCODING: "",       // handle all encodings
    //     //CURLOPT_USERAGENT      => "spider", // who am i
    //     CURLOPT_AUTOREFERER: true,     // set referer on redirect
    //     CURLOPT_CONNECTTIMEOUT: 120,      // timeout on connect
    //     CURLOPT_TIMEOUT: 120,      // timeout on response
    //     CURLOPT_MAXREDIRS: 10,       // stop after 10 redirects
    //     //-------to post-------------
    //     CURLOPT_POST: true,
    //     CURLOPT_POSTFIELDS: params,	//$data,
    //     CURLOPT_SSL_VERIFYPEER: false,    // DONT VERIFY
    //     CURLOPT_SSL_VERIFYHOST: false,
    //     CURLOPT_CAINFO: "a.cer",
    // }
    return await axios.post(url + '?' + params).then(res => {
        return res;
    });
}

async function approve(data){
    const request = {
        'AMOUNT': data.amount,
        'CURRENCY': currency,
        'ORDER': convertToBinary(data.id),
        'RRN': data.RRN,                  //Bank's reference Number
        'INT_REF': data.INT_REF,
        'TERMINAL': terminal,
        'TRTYPE': '21',
        'TIMESTAMP': getUtcTime(),
        'NONCE': randomMd5(0,16),
    }

    const to_sign = ''
        + getLengthItem(request['AMOUNT'])
        + getLengthItem(request['CURRENCY'])
        + getLengthItem(request['ORDER'])
        + getLengthItem(request['RRN'])
        + getLengthItem(request['INT_REF'])
        + getLengthItem(request['TERMINAL'])
        + getLengthItem(request['TRTYPE'])
        + getLengthItem(request['TIMESTAMP'])
        + getLengthItem(request['NONCE']);

    let keyForSignIn = process.env.KEY_FOR_SIGN_IN;

    request['P_SIGN'] = crypto.createHmac("sha1", hex2bin(keyForSignIn)).update(to_sign).digest('hex').toString('base64');;

    let params = '';

    for (const [key,value] of Object.entries(request)){
        params += (key + '=' + value) + '&';
    }

    params = params.slice(0, -1);

    const url = process.env.AZERICARD_URL;

    return await sendForCheckout(url,params);
}

module.exports = {
    apply,
    approve
}