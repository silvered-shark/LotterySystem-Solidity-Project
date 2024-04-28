const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const { abi, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
})

describe('Lottery Contract', () => {
    //deploys a contract test correctly
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    })

    //allows one account to enter
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]);//This line asserts that the first player in the list of players returned by getPlayers is the same as the account that entered the lottery. accounts[0]
        assert.equal(1, players.length);   //This line asserts that the length of the players array returned by getPlayers is 1. This is because only one account has entered the lottery.
    })


    //allows multiple account to enter
    it('allows mutliple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        })
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3, players.length);

    })

    it('requires a minimum amount of ether to enter in the lottery', async () => {
        try {

            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200 //it is 200wei
            })
            assert(false)  //This line is executed if the attempt to enter the lottery with insufficient Ether does not throw an error. However, in this case, it's immediately followed by a catch block, so it won't actually be reached. Its purpose is to fail the test if the attempt to enter the lottery does not throw an error.

            //assert(flase) will always fail the test

        } catch (error) {
            assert(error);  //It uses the assert function to verify that an error occurred. If an error occurred in this case there should be an error, the test passes. 
        }
    })

    it('only manager can call pickWinner',async()=>{
        try {
            await lottery.methods.pickWinner().send({
                from:accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    })
})