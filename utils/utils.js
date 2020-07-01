const Web3 = require('web3');

module.exports = {

    stringToBytes: (data) => {
        let stringLenth = data.length;
        if (stringLenth <= 32) {
            let bytes = Web3.utils.fromAscii(data);
            while (bytes.length < 66) {
                bytes += "0";
            }
            return bytes;
        } else {
            let bytes = [];
            let fragments = data.match(/.{1,32}/g);
            fragments.forEach(element => {
                bytes.push(Web3.utils.fromAscii(element));
            });
            while (bytes[bytes.length - 1].length < 66) {
                bytes[bytes.length - 1] += "0";
            }
            return bytes;
        }
    },

    bytesToString: (data) => {
        if (typeof data === "string") {
            let dataToString = (Web3.utils.toAscii(data)).replace(/\0/g, '');
            return dataToString;
        } else if (typeof data === "object") {
            let result = '';
            for (let index = 0; index < data.length; index++) {
                if (index === data.length - 1) {
                    result += (Web3.utils.toAscii(data[index])).replace(/\0/g, '');
                } else {
                    result += Web3.utils.toAscii(data[index]);
                }
            }
            return result;
        }
    },

    currentTime: () => {
        let now = Math.floor(new Date().getTime() / 1000);
        return now;
    },


}

