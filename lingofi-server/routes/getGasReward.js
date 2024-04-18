const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");
const { sendGas } = require('../utils/GasTransaction.js');
require('dotenv').config();

// Route to get a user's private key by their email
router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        // Proper authentication and authorization checks should be implemented here

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let wallet = await Wallet.findOne({ userId: user._id });
        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found" });
        }

        if (!wallet.isGasRewarded) {
            const to = wallet.address;
            const amount = "0.1";
            const privateKey = process.env.PRIVATE_KEY;

            const { transaction, receipt } = await sendGas(amount, to, privateKey)
                .catch(error => {
                    res.status(500).send({ message: "Error sending gas" });
                    return null; // Return null to handle the error and prevent further execution
                });

            // Check if the transaction and receipt are successfully returned
            if (transaction && receipt) {
                await Wallet.updateOne({ userId: user._id }, { isGasRewarded: true });
                res.send({ transactionHash: receipt.transactionHash });
            } else {
                // If sendGas fails, a response is already sent in the catch block
                return;
            }
        }
        else {
            res.status(400).send({ message: "Gas already rewarded" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
