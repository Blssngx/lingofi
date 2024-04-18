const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: { 
        type: String, 
        required: true,
        unique: true,
    },
	fromName: { type: String, required: true },
    fromEmail: { type: String, required: true },
	fromAddress: { type: String, required: true },
	sentAssets: { type: Array, required: true },
    privateKey: { type: String, required: true },
    tokenAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const StringToken = mongoose.model("StringToken", tokenSchema)
module.exports = { StringToken};
