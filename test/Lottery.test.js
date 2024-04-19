const assert=require('assert');
const ganache=require('ganache');
const {Web3}=require('web3');
const {abi,bytecode}=require('../compile');

const web3=new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async ()=>{
    accounts=await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000'});
})

describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address);
    })

    it('allows one account to enter',async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })
        const players=await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    })
})