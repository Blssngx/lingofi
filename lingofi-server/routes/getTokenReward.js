const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");
const { sendToken } = require('../utils/TokenTransaction.js');
require('dotenv').config();

// Route to get a user's private key by their email
router.get("/:email/:tokenAddress", async (req, res) => {
    try {
        const email = req.params.email;
        const tokenAddress = req.params.tokenAddress;
        // Proper authentication and authorization checks should be implemented here

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let wallet = await Wallet.findOne({ userId: user._id });
        if (!wallet) {
            return res.status(404).send({ message: "Wallet not found" });
        }

        const to = wallet.address;
        console.log('Sending gas to:', to);
        const amount = "3";
        // The `from` address does not seem to be used in sendGas function based on your example
        // Ensure that if `from` is needed, it's handled appropriately in your sendGas implementation
        const privateKey = process.env.PRIVATE_KEY;

        const { transaction, receipt } = await sendToken(amount, to, from, privateKey, tokenAddress)
            .catch(error => {
                console.error('Error sending token:', error);
                res.status(500).send({ message: "Error sending token" });
                return null; // Return null to handle the error and prevent further execution
            });

        // Check if the transaction and receipt are successfully returned
        if (transaction && receipt) {
            console.log('Transaction sent:', transaction);
            console.log('Transaction receipt:', receipt);
            res.send({ transactionHash: receipt.transactionHash });
        } else {
            // If sendGas fails, a response is already sent in the catch block
            return;
        }
    } catch (error) {
        console.error("Failed to send token", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
