const celo_mainnet = {
    chainId: '42220',
    name: 'Celo',
    blockExplorerUrl: 'https://explorer.celo.org',
    rpcUrl: 'https://forno.celo.org',
};

const celo_alfajores = {
    chainId: '44787',
    name: 'Celo Alfajores',
    blockExplorerUrl: 'https://explorer.celo.org/alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
};

const CHAINS_CONFIG = {
    [celo_mainnet.chainId]: celo_mainnet,
    [celo_alfajores.chainId]: celo_alfajores,
};

// Export the configurations
module.exports = {
    celo_mainnet,
    celo_alfajores,
    CHAINS_CONFIG,
};
