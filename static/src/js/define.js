/*
    Implementation of an AMD "define" function to bridge the gap
    between Odoo and Typescript / AMD Modules :)
*/
'use strict';

window.define = function(moduleName, moduleReqs, impl) {
    console.debug('Registering AMD Module: ', moduleName, moduleReqs);

    const odooReqs = moduleReqs.filter(r => r != 'require' && r != 'exports');

    odoo.define(moduleName, odooReqs, function(require) {
        const exports = {};
        const implArgs = [];
        moduleReqs.forEach((req) => {
            if (req == 'require') implArgs.push(require);
            else if (req == 'exports') implArgs.push(exports);
            else implArgs.push(require(req));
        })
        impl.apply(null, implArgs);
        return exports;
    });
}