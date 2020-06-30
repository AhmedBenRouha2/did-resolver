const services = require('./services/did-resolver.service');

module.exports = {

    wrapDIdToDocument: (req, res, next) => {

        let did = req.params.did;
        let contractAddress = "0x" + did.split(':')[2];
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '#' + req.get('hash');
        myURL = new URL(fullUrl);
        console.log(fullUrl)
        services.getEventsHistory('DIDAttributeChanged', contractAddress).then(events => {
            let did_document = services.formatAttributes(events, did);
            if (req.query.publicKey) {
                return (services.filterDidDocument(req.query.publicKey, did_document.publicKey));
            } if (req.query.service) {
                return (services.filterDidDocument(req.query.service, did_document.service));
            } if (req.query.authentication) {
                return (services.filterDidDocument(req.query.authentication, did_document.authentication));
            }
            else {
                return (did_document);
            }
        })
    },


    addDelegate: (req, res, next) => {
        let data = req.body;
        let contractAddress = data.contractAddress
        let delegateAddress = data.delegateAddress
        let validTo = data.delegateAddress
        let citizenAddress = data.citizenAddress

        services.unlockAccount(citizenAddress).then(result => {
            services.addDelegate(delegateAddress, validTo, contractAddress, citizenAddress).then(result => {
                return (result);
            })
        })
    },

    manageAttribute: (req, res, next) => {
        let action = req.params.action;
        if (action === 'add' || action === 'revoke') {
            let data = req.body;
            let contractAddress = data.contractAddress
            let attributeType = data.attributeType
            let value = data.value
            let citizenAddress = data.citizenAddress
            let valideTo = 0;
            if (action === 'add') {
                valideTo = data.valideTo

            }
            services.unlockAccount(citizenAddress).then(result => {
                services.addAttribute(attributeType, valideTo, value, contractAddress, citizenAddress).then(result => {
                    return (result);
                })
            })
        }
    },
}
