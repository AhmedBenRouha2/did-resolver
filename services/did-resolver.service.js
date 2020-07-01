var Web3 = require('web3');
const utils = require('../utils/utils');

module.exports = function Services(provider, ABI) {
    this.web3 = new Web3(provider),
        this.identityContractABI = ABI,
        this.getEventsHistory = async (eventName, contractAddress) => {
            console.log(ABI)
            var identityContract = new this.web3.eth.Contract(this.identityContractABI, contractAddress);
            return new Promise(resolve => {
                identityContract.getPastEvents(eventName, {
                    fromBlock: 0,
                    toBlock: 'latest'
                }).then(events => {
                    resolve(events);
                });
            });
        },

        this.formatAttributes = (data, did) => {
            try {
                let did_document = {
                    "@context": "https://www.w3.org/ns/did/v1",
                    "id": did,
                    "publicKey": [],
                    "service": [],
                    "authentication": []
                };
                let publicKeys = new Map();
                let services = new Map();
                let authentications = new Map();
                data.forEach(element => {
                    if (parseInt(element.returnValues["_valideTo"]) >= utils.currentTime()) {
                        let attributeType = utils.bytesToString(element.returnValues["attributeType"]);
                        let attribute = JSON.parse(utils.bytesToString(element.returnValues["value"]));
                        if (attributeType === 'publicKey') {
                            publicKeys.set(attribute.id, attribute);
                        }
                        if (attributeType === 'service') {
                            services.set(attribute.id, attribute);
                        }
                        if (attributeType === 'authentications') {
                            authentications.set(attribute.id, attribute);
                        }
                    } else if (parseInt(element.returnValues["_valideTo"]) === 0) {
                        let attributeType = utils.bytesToString(element.returnValues["attributeType"]);
                        let attribute = JSON.parse(utils.bytesToString(element.returnValues["value"]));
                        if (attributeType === 'publicKey') {
                            publicKeys.delete(attribute.id)
                        }
                        if (attributeType === 'service') {
                            services.delete(attribute.id);
                        }
                        if (attributeType === 'authentications') {
                            authentications.delete(attribute.id);
                        }
                    } else {
                        console.log("expired")
                    }
                });
                const publicKeysIterator = publicKeys.keys();
                let publicKeyMapIndex = publicKeysIterator.next().value;
                while (publicKeyMapIndex != undefined) {
                    did_document.publicKey.push(publicKeys.get(publicKeyMapIndex));
                    publicKeyMapIndex = publicKeysIterator.next().value;
                }
                const servicesIterator = services.keys();
                let serviceMapIndex = servicesIterator.next().value;
                while (serviceMapIndex != undefined) {
                    did_document.service.push(services.get(serviceMapIndex));
                    serviceMapIndex = servicesIterator.next().value;
                }
                const authenticationsIterator = authentications.keys();
                let authenticationMapIndex = authenticationsIterator.next().value;
                while (authenticationMapIndex != undefined) {
                    did_document.authentication.push(authentications.get(authenticationMapIndex));
                    authenticationMapIndex = authenticationsIterator.next().value;
                }
                return did_document;
            } catch (error) {
                console.log(error)
            }
        },

        this.filterDidDocument = (filter, data) => {
            const found = data.find(element => (element.id === filter || element.type === filter));
            return found;
        },

        this.addDelegate = async (delegateAddress, validTo, contractAddress, citizenAddress) => {
            var identityContract = new this.web3.eth.Contract(this.identityContractABI, contractAddress);
            return new Promise((resolve, reject) => {
                identityContract.methods.addDelegate(delegateAddress, validTo).send({
                    from: citizenAddress,
                    gas: 1500000,
                    gasPrice: '300000000000'
                }).then(result => {
                    console.log("result")
                    resolve(result);
                }).catch(error => {
                    console.log("error")
                    console.log(error)

                });
            })
        },

        this.addAttribute = async (attributeType, valideTo, value, contractAddress, citizenAddress) => {
            var identityContract = new this.web3.eth.Contract(this.identityContractABI, contractAddress);
            return new Promise((resolve, reject) => {
                identityContract.methods.addAttribute(attributeType, valideTo, value).send({
                    from: citizenAddress,
                    gas: 1500000,
                    gasPrice: 300000000000
                }).then(result => {
                    console.log("result")
                    resolve(result);
                }).catch(error => {
                    console.log("error")
                    console.log(error)
                });
            })
        },

        this.unlockAccount = async (address) => {
            return await web3.eth.personal.unlockAccount(address, "", 30000);
        }
}