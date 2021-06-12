const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, "../", ".env") });

const mnemonicPhrase = process.env.MNEMONIC_PHRASE;
const providerUrl = process.env.PROVIDER_OR_URL;

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: providerUrl
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const deploymentAccount = accounts[0];

    const privateKey = provider.wallets[
        deploymentAccount.toLowerCase()
    ].privateKey.toString("hex");

    console.log('Attempting to deploy from account', deploymentAccount);

    try {
        const contract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: '0x' + compiledFactory.bytecode })
            .encodeABI();

        const transactionObject = {
            gas: 1000000,
            data: contract,
            from: deploymentAccount
        };

        const signedTransactionObject = await web3.eth.accounts.signTransaction(
            transactionObject,
            "0x" + privateKey
        );

        const result = await web3.eth.sendSignedTransaction(
            signedTransactionObject.rawTransaction
        );

        console.log('Contract deployed to', result.contractAddress);
    }
    catch (err) {
        console.log('ERROR!!!!!', err)
    }
    process.exit();

};

deploy(); //call the function
