import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x0D0539F749CdD0267B32b4FbcC8f9cEC5173e3d1'
);

export default instance;
