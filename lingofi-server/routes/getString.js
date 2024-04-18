const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");
const { sendToken } = require('../utils/TokenTransaction.js');
const { StringToken } = require("../models/string");
const { celo_alfajores } = require('../utils/Chain.js');
const Joi = require("joi");
require('dotenv').config();

// Route to get a user's private key by their email
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const toAddress = req.body.toAddress;
        const token = req.body.token;

        let stringToken = await StringToken.findOne({ token: token });
        if (!stringToken) {
            return res.status(404).send({ message: "Token not found" });
        }

        const to = toAddress;
        console.log('Sending token to:', to);
        const amount = stringToken.amount;
        console.log('Amount: ', amount);
        const privateKey = stringToken.privateKey;
        console.log("privateKey", privateKey);
        const tokenAddress = stringToken.tokenAddress;
        console.log('Token Address:', tokenAddress);

        const { transaction, receipt } = await sendToken(amount, to, privateKey, tokenAddress)
            .catch(error => {
                console.error('Error sending token:', error);
                res.status(500).send({ message: "Error sending token" });
                return null;
            });

        if (transaction && receipt) {
            await stringToken.remove();
            res.send({ transactionHash: `${celo_alfajores.blockExplorerUrl}/tx/${receipt.transactionHash}` });
        } else {
            return;
        }

    } catch (error) {
        console.error("Failed to send token", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        toAddress: Joi.string().required().label("ToAddress"),
        token: Joi.string().required().label("Token"),
    });
    return schema.validate(data);
};

module.exports = router;
