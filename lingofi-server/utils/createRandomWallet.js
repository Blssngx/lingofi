const { ethers } = require('ethers');

function createRandomWallet() {
    const entropy = ethers.utils.randomBytes(32); // Generate random entropy
    const mnemonic = ethers.utils.entropyToMnemonic(entropy); // Convert entropy to mnemonic
    const derivationPath = "m/44'/60'/0'/0/0"; // Standard Ethereum derivation path for the first account
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, derivationPath); // Create the wallet from mnemonic

    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: mnemonic, // Recovery phrase
    };
}

module.exports = { createRandomWallet };