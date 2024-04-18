const router = require("express").Router();
const { User } = require("../models/user");
const Wallet = require("../models/wallet");
const Token = require("../models/token");
const { StringToken } = require("../models/string");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { getTokenAddress } = require("../utils/getTokenAddress");
require('dotenv').config();

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const email = req.body.email;
        const amount = req.body.amount;
        const currency = req.body.currency;

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
        const sentAssets = amount + " " + currency;
        const tokenAddress = await getTokenAddress(currency);
        const amountToSend = amount;
        const token = crypto.randomBytes(32).toString("hex");

        const stringToken = await new StringToken({
            token: token,
            fromName: fromName,
            fromEmail: fromEmail,
            fromAddress: fromAddress,
            sentAssets: sentAssets,
            privateKey: privateKey,
            tokenAddress: tokenAddress,
            amount: amountToSend,
        }).save();

        const stringUrl = `https://string.lingofi.xyz/${stringToken.token}`;

        res.status(200).send({ data: stringUrl, message: "String created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        amount: Joi.string().required().label("Amount"),
        currency: Joi.string().required().label("Currency"),
    });
    return schema.validate(data);
};

module.exports = router;
