const header = require('./header');

const config = {
    entry: './src/index.js'
};

module.exports.config = config;
module.exports.header = header;
module.exports.buildedHeader = () => {
    const headerString = [];
    headerString.push('// ==UserScript==');
    for (let headerKey in header) {
        if (Array.isArray(header[headerKey])) {
            if (header[headerKey].length > 0) headerString.push('//');
            for (let p in header[headerKey]) {
                headerString.push(
                    '// @' + headerKey.padEnd(13) + header[headerKey][p]
                );
            }
        } else {
            headerString.push(
                '// @' + headerKey.padEnd(13) + header[headerKey]
            );
        }
    }
    headerString.push('// ==/UserScript==');
    headerString.push('');
    return headerString.join('\n');
};
