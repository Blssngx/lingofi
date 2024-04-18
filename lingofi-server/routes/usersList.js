const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");

router.get("/", async (req, res) => {
    try {
        // Fetch all verified users
        const users = await User.find({ verified: true }).select('firstName lastName _id');
        if (!users.length) {
            return res.status(404).send({ message: "No verified users found" });
        }

        // Extract user IDs
        const userIds = users.map(user => user._id);

        // Fetch wallets for these user IDs
        const wallets = await Wallet.find({ userId: { $in: userIds } });

        // Map wallets back to users
        const userWallets = users.map(user => {
            const walletDetails = wallets.find(wallet => wallet.userId.equals(user._id));
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                wallet: walletDetails.address,
            };
        });

        res.status(200).send({ data: userWallets });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error });
    }
});

module.exports = router;
