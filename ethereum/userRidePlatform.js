import web3 from './web3';
import UserRidePlatformContract from './build/UserRidePlatformContract.json';

export default (address) =>{
  const instance = new web3.eth.Contract(
    JSON.parse(UserRidePlatformContract.interface),
    address
  );

  return instance ;
}
