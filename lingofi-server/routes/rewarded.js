const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");
const { sendGas } = require('../utils/GasTransaction.js');
require('dotenv').config();

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

        if (wallet.isGasRewarded && wallet.isTokenRewarded) {
            res.send({ rewarded: true });
        }
        else {
            res.status(400).send({ rewarded: false });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
