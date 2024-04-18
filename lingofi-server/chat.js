const { strictOutput } = require('./utils/gpt.js');
const { getAddress } = require('./utils/getAddress.js');
const { sendGas } = require('./utils/GasTransaction.js');
const { sendToken } = require('./utils/TokenTransaction.js');
const { getTokenAddress } = require('./utils/getTokenAddress.js');
const { celo_alfajores } = require('./utils/Chain.js');
require('dotenv').config();

async function chat() {
    // const inputValue = "tuma Timothy 1 cusd kwa anwani yake kwa gharama za safari yetu";
    // const inputValue = "Send 1 Celo to Ella for our trip";
    // const inputValue = "Ek wil vir Timothy 2 Celo stuur vir die klavier";
    const inputValue = "Ella, bana elbise almam için 1 celo gönder"; // Turkish
    // const inputValue = "Send one cUSD to Timothy for trips expenses";
    console.log("Input command:", inputValue);
    try {
        // Generate a transaction payload
        const txPayload = await strictOutput(
            "Interpret the input command to generate a transaction payload that can be processed by the blockchain network.",
            `Construct a transaction payload for the input command: ${inputValue}`,
            {
                currency: "Extract the currency from the input command, there can only be Celo, cUSD, cEUR or cREAL",
                amount: "Determine the amount to be sent. As an interger",
                recipient: "Extract the recipient from the input command. Strictly the name",
                reason: "Extract the reason for the transaction from the input command. If not available, use Transaction as the reason.",
            }
        );

        // Get the wallet address of the recipient and send gas
        const to = await getAddress(txPayload.recipient);
        const tokenAddress = await getTokenAddress(txPayload.currency);
        console.log("Token Address: ",tokenAddress);
        console.log("Tx Payload:", txPayload);
        console.log('Recipient wallet Address:', to);
        console.log("Transaction payload and wallet address retrieved successfully");

        // Process the transaction
        const amount = txPayload.amount;
        const privateKey = process.env.PRIVATE_KEY;

        const { transaction, receipt } = await sendToken(amount, to, privateKey, tokenAddress);

        // Check if the transaction and receipt are successfully returned
        if (transaction && receipt) {
            // console.log("Gas sent successfully");
            console.log("Transaction hash: ", `${celo_alfajores.blockExplorerUrl}/tx/${receipt.transactionHash}`);
            // Assuming res is defined in your scope. If this is an Express handler, it should be.
        }

    } catch (error) {
        console.error("Error processing transaction:", error);
    }
}

chat();
