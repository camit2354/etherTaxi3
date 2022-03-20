import web3 from './web3';
import DriverProfileContract from './build/DriverProfileContract.json';

export default (address)=> {

  const instance = new web3.eth.Contract(
    JSON.parse(DriverProfileContract.interface),
    address
  );

  return instance ;

}
