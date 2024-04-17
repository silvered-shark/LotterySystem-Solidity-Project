const HDWalletProvider = require('@truffle/hdwallet-provider');

const Web3 = require('web3');
const {abi,bytecode} = require('./compile');

const provider = new HDWalletProvider(
    "rotate valley average list misery tip soda fringe human wage area table","https://linea-sepolia.infura.io/v3/4a0c53a5e4d34ddfa9725982d54c25b5"
)

const web3 = new Web3(provider); // instance of web3

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address);
};

deploy(); // call the deploy function