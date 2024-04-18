// Define an interface for the chain configuration objects
interface ChainConfig {
    chainId: string;
    name: string;
    blockExplorerUrl: string;
    rpcUrl: string;
}

// Define configurations for celo mainnet and alfajores testnet
const celo_mainnet: ChainConfig = {
    chainId: '42220',
    name: 'Celo',
    blockExplorerUrl: 'https://explorer.celo.org',
    rpcUrl: 'https://forno.celo.org',
};

const celo_alfajores: ChainConfig = {
    chainId: '44787',
    name: 'Celo Alfajores',
    blockExplorerUrl: 'https://explorer.celo.org/alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    // rpcUrl: 'https://celo-alfajores.infura.io/v3/8f43ca69ad8f44218d6873f2f70bb8a2'
};

// Group the configurations in an object using the chain IDs as keys
const CHAINS_CONFIG: Record<string, ChainConfig> = {
    [celo_mainnet.chainId]: celo_mainnet,
    [celo_alfajores.chainId]: celo_alfajores,
};

// Export the configurations
export { celo_mainnet, celo_alfajores, CHAINS_CONFIG };
