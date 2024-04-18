const router = require("express").Router();
const { User } = require("../models/user");
const  Wallet  = require("../models/wallet");
require('dotenv').config();

// Route to get a user's private key by their email
router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let wallet = await Wallet.findOne({ userId: user._id });
        res.send({ publicKey: wallet.address });
    } catch (error) {
        console.error("Failed to retrieve public key", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
