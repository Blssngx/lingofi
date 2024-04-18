const { strictOutput } = require('./utils/gpt.js');
const { getAddress } = require('./utils/getAddress.js');
const { sendGas } = require('./utils/GasTransaction.js');
const { sendToken } = require('./utils/TokenTransaction.js');
const { getTokenAddress } = require('./utils/getTokenAddress.js');
const { celo_alfajores } = require('./utils/Chain.js');
const { User } = require("./models/user");
const Wallet = require("./models/wallet");
const { StringToken } = require("./models/string");
require('dotenv').config();

async function chat() {
    const email = "blessinghove69@gmail.com";
    const inputValue = "Create a withdrawal string for 1 cUSD for trips expenses to Timothy at his address.";
    try {
        // Generate a transaction payload
        const txPayload = await strictOutput(
            "Interpret the input command to generate a transaction payload that can be processed by the blockchain network.",
            `Construct a transaction payload for the input command: ${inputValue}`,
            {
                currency: "Extract the currency from the input command, there can only be Celo, cUSD, cEUR or cREAL",
                amount: "Determine the amount to be sent.",
                // recipient: "Extract the recipient from the input command. Strictly the name",
                reason: "Extract the reason for the transaction from the input command.",
            }
        );

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let wallet = await Wallet.findOne({ userId: user._id });

        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found" });
        }

        const fromEmail = email;
        const fromName = user.firstName + " " + user.lastName;
        const fromAddress = wallet.address;
        const privateKey = wallet.privateKey;
        const sentAssets = amount + " " + txPayload.currency;
        const tokenAddress = await getTokenAddress(txPayload.currency);
        const amountToSend = amount;
        const token = crypto.randomBytes(32).toString("hex");

        console.log('Sending from:', fromEmail);
        console.log('privateKey:', privateKey);
        console.log('tokenAddress:', tokenAddress);
        console.log('amount:', amountToSend);
        console.log('token:', token);

       
        // console.log('Wallet Address:', to);
        console.log("Transaction payload and wallet address retrieved successfully");

        // Process the transaction
        // const amount = txPayload.amount;
        // const privateKey = process.env.PRIVATE_KEY;

        // const { transaction, receipt } = await sendToken(amount, to, privateKey, tokenAddress);

        // // Check if the transaction and receipt are successfully returned
        // if (transaction && receipt) {
        //     // console.log("Gas sent successfully");
        //     console.log("Transaction hash: ", `${celo_alfajores.blockExplorerUrl}/tx/${receipt.transactionHash}`);
        //     // Assuming res is defined in your scope. If this is an Express handler, it should be.
        // }

    } catch (error) {
        console.error("Error processing transaction:", error);
    }
}

chat();
