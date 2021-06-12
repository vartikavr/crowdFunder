const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    factory.setProvider(provider);

    await factory.methods.createCampaign('100').send({    //100 wei => minimum contribution
        from: accounts[0],
        gas: '1000000'
    });

    //destructuring used below => [campaignAddress] 
    //tells that an array would be returned, so take first element of that 
    //array and assign it to campaignAddress
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call({
        from: accounts[0]
    });

    //since we've already deployed our instance of campaign(by createCampaign()), we'll 
    //pass it's address along with compiled interface
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

})

describe('Campaign', () => {
    it('deploys a factory and a campaign contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows to contribute and marks them as contributes', async () => {
        await campaign.methods.contribute().send({
            value: '200', //since minimum contribution is 100 here
            from: accounts[1]
        });

        const isContributor = await campaign.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a min contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '10',
                from: accounts[1]
            });
            assert(false);
        }
        catch (err) {
            assert(err);
        }
    });

    it('restricted access to make a payment request', async () => {
        await campaign.methods.createRequest(
            "buy batteries",
            '50',
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const newRequest = await campaign.methods.requests(0).call();

        assert.equal("buy batteries", newRequest.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            "buy materials",
            web3.utils.toWei('5', 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]); // returns a string with balance in wei
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        console.log(balance);
        assert(balance > 104);
    });
});