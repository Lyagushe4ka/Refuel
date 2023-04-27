const Web3 = require('web3');
const fs = require('fs');

const abiFile = fs.readFileSync('./abi.json', 'utf8');
const contractAbi = JSON.parse(abiFile);

const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon.llamarpc.com'));

const contractAddress = '0xAC313d7491910516E06FBfC2A0b5BB49bb072D91';

const contract = new web3.eth.Contract(contractAbi, contractAddress);

const privateKey = '0x' + fs.readFileSync('./privateKey.txt', 'utf8');
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const chainId = 250;
const tokenValue = web3.utils.toWei('0.5', 'ether');
const gasPrice = web3.utils.toWei('400', 'gwei');

const refuel = async () => {
    const refuel = await contract.methods.depositNativeToken(chainId, account.address).send({
        from: account.address,
        gas: 500000,
        value: tokenValue,
        gasPrice: gasPrice
    });
    console.log(refuel.transactionHash);
};

const getData = async () => {
    const data = await contract.methods.getChainData(chainId).call();
    console.log(data);
};

getData();
refuel();
