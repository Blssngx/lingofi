// Import necessary modules and types
import { ethers } from 'ethers';
import { celo_alfajores, CHAINS_CONFIG } from '@/utils/chain';
// Define the ABI for the ERC-20 token contract
const Erc20Abi = [
    "function transfer(address to, uint amount) returns (bool)",
];

// Define the function to send tokens
async function sendToken(
    amount: string | number,
    to: string,
    // from: string,
    privateKey: string,
    tokenAddress: string,
    tokenDecimals: number = 18
): Promise<{ transaction: ethers.providers.TransactionResponse, receipt: ethers.providers.TransactionReceipt }> {
    const chain = CHAINS_CONFIG[celo_alfajores.chainId];
    console.log("Chain", chain);
    // Create a provider using the RPC URL for the chain
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
    // console.log("Balance: ", provider.getBalance(from));
    // Create a wallet instance from the sender's private key and connect it to the provider
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Wallet", wallet);
    // The ERC-20 contract for the token you wish to transfer
    const contract = new ethers.Contract(tokenAddress, Erc20Abi, wallet);
    console.log("Contract", contract);
    // Ensure the amount is formatted correctly for the token's decimals
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), tokenDecimals);
    console.log("Formatted Amount:", formattedAmount);
    // Perform the transfer
    const transaction = await contract.transfer(to, formattedAmount);

    
    console.log("Transaction", transaction);
    // Wait for the transaction to be mined
    const receipt = await transaction.wait();

    return { transaction, receipt };
}

// Export the sendToken function
export { sendToken };
