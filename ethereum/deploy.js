const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const mainServerContract = require('./build/MainServerContract.json');

const fs = require('fs') ;

const provider = new HDWalletProvider(
  'jazz antenna magnet long call dose vapor reunion vessel swift van iron',
  // remember to change this to your own phrase!
  'https://rinkeby.infura.io/v3/6d0967a9ec31471483ed25f922a80dde'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(mainServerContract.interface)
  )
    .deploy({ data: mainServerContract.bytecode })
    .send({ gas: '5000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);

  
  provider.engine.stop();

  return result.options.address ;
};

deploy();
