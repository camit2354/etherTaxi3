import web3 from './web3';
import UserProfileContract from './build/UserProfileContract.json';

export default (address)=> {

  const instance = new web3.eth.Contract(
    JSON.parse(UserProfileContract.interface),
    address
  );

  return instance ;

}

