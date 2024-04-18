const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const Wallet = require("../models/wallet");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const {createRandomWallet}= require("../utils/createRandomWallet");
const confirmEmailTemplate = require("../templates/confirm-email");
require('dotenv').config();

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.APP_URL}/users/${user.id}/verify/${token.token}`;
		const verifyEmail = confirmEmailTemplate(user.email, url);
		await sendEmail(user.email, "Verify Email", verifyEmail);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		// Create a wallet for the verified user
		const newWallet = createRandomWallet();
		console.log(newWallet);
		// Store the wallet in MongoDB
		const walletDocument = new Wallet({
			userId: user._id,
			address: newWallet.address,
			privateKey: newWallet.privateKey,
			mnemonic: newWallet.mnemonic,
		});

		await walletDocument.save();

		// Verify the user
		await User.updateOne({ _id: user._id }, { verified: true });

		await token.remove();
		res.status(200).send({ message: "Email verified successfully and wallet created" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
