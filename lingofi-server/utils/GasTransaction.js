const { celo_alfajores, CHAINS_CONFIG } = require('./Chain.js');
const { ethers } = require('ethers');

async function sendGas(amount,to,  privateKey) {
    const chain = CHAINS_CONFIG[celo_alfajores.chainId];

    // Create a provider using the RPC URL for Arbitrum Sepolia
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);

    // Create a wallet instance from the sender's private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // Construct the transaction object
    const tx = {
        to,
        value: ethers.utils.parseEther(amount.toString()),
    };

    // Sign the transaction with the sender's wallet
    const transaction = await wallet.sendTransaction(tx);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();

    return { transaction, receipt };
}

module.exports = { sendGas };
