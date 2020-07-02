# did-resolver

#Import
const DidResolver = require('did-resolver-module-test3')
const did_resolver = new DidResolver(statics.provider, identityContractABI);

#resolve did
//did example = did:eth:smart_contract_address
didResolver.wrapDIdToDocument(did).then((data) => {
      //data = did document
});
