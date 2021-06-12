import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x36e6329CA89B1677acB1D473e5089c4F491f8113'
);

export default instance;