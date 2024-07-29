// dependencies
const fs = require('fs')
const dirData = require('path')
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

// set network
// mainnet: bitcoin.networks.bitcoin
// testnet: bitcoin.networks.testnet

const network = bitcoin.networks.testnet

// derive m/49'/0'/0'/0 HD wallet BTC
// derive m/49'/1'/0'/0 HD wallet testnet BTC
const path = "m/49'/1'/0'/0"

// generate mnemonic to seed (wordskey)
let mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)

// criate root HD wallet
let root = bip32.fromSeed(seed, network)

// create account - par pvt-pub keys
let account = root.derivePath(path)
let node = account.derive(0).derive(0)

let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network
}).address

let output = "Wallet generated\n"
output += " BTC Address: " + btcAddress + "\n"
output += " Private key: " + node.toWIF() + "\n"
output += " Mnemonic: " + mnemonic + "\n\n"

// Sets the path of the file within the 'data' directory
const dataDir = dirData.join(__dirname, 'data');
const filePath = dirData.join(dataDir, 'walletsGenerated.txt');

// Create directory 'data' if it doesn't exist.
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.appendFile(filePath, output, (err) => {
    if (err) throw err;
    console.log('The data was appended to file!');
});

console.log(output)
