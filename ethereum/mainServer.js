import web3 from './web3';
import MainServerContract from './build/MainServerContract.json';

const instance = new web3.eth.Contract(
  JSON.parse(MainServerContract.interface),
  '0x7b28f0BE23d36BDEA484361833ff5910c1aFd9f0'
);

export default instance;