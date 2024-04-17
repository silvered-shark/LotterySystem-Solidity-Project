const path=require('path') // path module is used to get the path of the file
const fs=require('fs')  // fs module is used to read the file
const solc=require('solc') // solc module is used to compile the solidity code

const contractPath=path.resolve(__dirname,'contracts','Lottery.sol') // path of the file
const source=fs.readFileSync(contractPath,'utf8') 

const input={
    language: 'Solidity',
    sources: {
        'Lottery.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};
const output=JSON.parse(solc.compile(JSON.stringify(input))) // compile the solidity code
const contract=output.contracts['Lottery.sol']['Lottery'] 
console.log(contract)

module.exports={
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
}