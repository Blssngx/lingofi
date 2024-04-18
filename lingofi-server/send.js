const { sendToken } = require('./utils/TokenTransaction.js');
const { sendGas } = require('./utils/GasTransaction.js');
require('dotenv').config();

// Assuming this code snippet is inside an async function
async function sendGasAndLogTransaction() {
    const amount = "1";
    const to = "0x80C8Ab0d65868CcB0AF23D99762196AFe2aa18A7";
    const privateKey = process.env.PRIVATE_KEY;
    try {
        const { transaction, receipt } = await sendGas(amount, to, privateKey);

        // Check if the transaction and receipt are successfully returned
        if (transaction && receipt) {
            // await Wallet.updateOne({ userId: user._id }, { isGasRewarded: true });
            console.log("Gas sent successfully");
            console.log("Transaction hash: ", receipt.transactionHash);
            // Assuming res is defined in your scope. If this is an Express handler, it should be.
            // res.send({ transactionHash: receipt.transactionHash });
        }
    } catch (error) {
        console.error("Error sending gas:", error);
        // Ensure res is available in this scope, if it's part of an Express handler, it should be.
        // res.status(500).send({ message: "Error sending gas" });
        // No need to return null here; the function will exit after res.status().send() anyway.
    }
}

sendGasAndLogTransaction();