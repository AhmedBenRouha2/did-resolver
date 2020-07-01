var Web3 = require('web3');
const identityContractABI = require('../statics/smart_contracts/identity/ABI.json');
const statics = require('../statics/statics.json');
const web3 = new Web3(statics.provider);
const utils = require('../utils/utils');

module.exports = {
    getEventsHistory: async (eventName, contractAddress) => {
        var identityContract = new web3.eth.Contract(identityContractABI, contractAddress);
        return new Promise(resolve => {
            identityContract.getPastEvents(eventName, {
                fromBlock: 0,
                toBlock: 'latest'
            }).then(events => {
                resolve(events);
            });
        });
    },

    formatAttributes: (data) => {
        try {
            data.forEach(element => {
                if (element.returnValues["_valideTo"] > utils.currentTime()) {
                    let attribute = utils.bytesToString(element.returnValues["value"]);
                    console.log(attribute)
                } else {
                    console.log("expired")
                }
            });
        } catch (error) {
            console.log(error)
        }
    },
}