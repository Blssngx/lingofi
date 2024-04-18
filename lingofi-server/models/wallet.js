const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user', // Assuming you have a User model to reference
        unique: true,
    },
    address: {
        type: String,
        required: true,
        unique: true // Ensures wallet addresses are unique
    },
    privateKey: {
        type: String,
        required: true
    },
    mnemonic: {
        type: String,
        required: true
    },
	isTokenRewarded: { type: Boolean, default: false },
	isGasRewarded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
