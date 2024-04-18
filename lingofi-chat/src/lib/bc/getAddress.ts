import wallets from './wallets.json';

interface Wallet {
    name: string;
    address: string;
}

async function getAddress(name: string): Promise<string> {
    try {
        // Assuming wallets is directly imported as an array of Wallet
        const wallet = wallets.find(w => w.name.toLowerCase() === name.toLowerCase());

        if (wallet) {
            return wallet.address;
        } else {
            throw new Error('No wallet found for the given name');
        }
    } catch (err) {
        throw new Error(`Error finding wallet: ${err}`);
    }
}

export { getAddress };
