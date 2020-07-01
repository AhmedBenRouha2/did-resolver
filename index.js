const Services = require('./services/did-resolver.service');

module.exports = function DidResolver(provider, ABI) {
    this.wrapDIdToDocument = (DID) => {
        let services = new Services(provider, ABI);
        let did = DID;
        let contractAddress = "0x" + did.split(':')[2];
        return new Promise((resolve, reject) => {
            services.getEventsHistory('DIDAttributeChanged', contractAddress).then(events => {
                let did_document = services.formatAttributes(events, did);
                resolve(did_document);

            })
        })

    },


        this.addDelegate = (DATA) => {
            let services = new Services(provider, ABI);
            let data = DATA;
            let contractAddress = data.contractAddress
            let delegateAddress = data.delegateAddress
            let validTo = data.delegateAddress
            let citizenAddress = data.citizenAddress
            return new Promise((resolve, reject) => {
                services.unlockAccount(citizenAddress).then(result => {
                    services.addDelegate(delegateAddress, validTo, contractAddress, citizenAddress).then(result => {
                        resolve(result);
                    })
                })
            });
        },

        this.manageAttribute = (_Action, _Data) => {
            let services = new Services(provider, ABI);
            let action = _Action;
            if (action === 'add' || action === 'revoke') {
                let data = _Data;
                let contractAddress = data.contractAddress
                let attributeType = data.attributeType
                let value = data.value
                let citizenAddress = data.citizenAddress
                let valideTo = 0;
                if (action === 'add') {
                    valideTo = data.valideTo
                }
                return new Promise((resolve, reject) => {
                    services.unlockAccount(citizenAddress).then(result => {
                        services.addAttribute(attributeType, valideTo, value, contractAddress, citizenAddress).then(result => {
                            resolve(result);
                        })
                    });
                });
            }
        },

        this.testAsync = (data) => {
            return new Promise((resolve, reject) => {

                resolve(data);

            });
        },
        this.testSync = (data) => {
            return(data);

        }
}
