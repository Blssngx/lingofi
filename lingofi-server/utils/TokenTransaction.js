
const { celo_alfajores, CHAINS_CONFIG } = require('./Chain.js');
const ethers = require('ethers');
require('dotenv').config()

const Erc20Abi = [
    "function transfer(address to, uint amount) returns (bool)",
];

async function sendToken(amount, to, privateKey, tokenAddress, tokenDecimals = 18) {
    const chain = CHAINS_CONFIG[celo_alfajores.chainId];

    // Create a provider using the RPC URL for Arbitrum Sepolia
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);

    // Create a wallet instance from the sender's private key and connect it to the provider
    const wallet = new ethers.Wallet(privateKey, provider);
    // "0x659782Cd3A22E97a982f834647e3B51Ff2aE78F0"
    // The ERC-20 contract for the token you wish to transfer
    const contract = new ethers.Contract(tokenAddress, Erc20Abi, wallet);

    // Ensure the amount is formatted correctly for the token's decimals
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), tokenDecimals);

    // Perform the transfer
    const transaction = await contract.transfer(to, formattedAmount);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();

    return { transaction, receipt };
}

module.exports = { sendToken };
