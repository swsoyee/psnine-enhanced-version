const monkey = require('../../../monkey.config');
module.exports = {
    info: (message) => {
        console.info(`[${monkey.header.name}]`, message);
    },
    debug: (message) => {
        console.debug(`[${monkey.header.name}]`, message);
    },
    warn: (message) => {
        console.warn(`[${monkey.header.name}]`, message);
    }
};
