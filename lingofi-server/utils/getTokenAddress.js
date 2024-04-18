const fs = require('fs');

function getTokenAddress(name) {
    return new Promise((resolve, reject) => {
        fs.readFile('data/tokens.json', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            // Parse the JSON data
            const wallets = JSON.parse(data);
            // Find the wallet entry matching the given name
            const wallet = wallets.find(w => w.name.toLowerCase() === name.toLowerCase());

            if (wallet) {
                resolve(wallet.address);
            } else {
                reject('No Token found for the given name');
            }
        });
    });
}

module.exports = {
    getTokenAddress
};