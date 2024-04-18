import tokens from './tokens.json';

interface tokens {
    name: string;
    address: string;
}

async function getTokenAddress(name: string): Promise<string> {
    try {

        const token = tokens.find(w => w.name.toLowerCase() === name.toLowerCase());

        if (token) {
            return token.address;
        } else {
            throw new Error('No token found for the given currency');
        }
    } catch (err) {
        throw new Error(`Error finding wallet: ${err}`);
    }
}

export { getTokenAddress };
