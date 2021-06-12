import Layout from '../../components/layout';
import { Component } from 'react';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/contributeForm';
import ErrorPage from 'next/error';
import { Link } from '../../routes';

class ShowCampaign extends Component {
    static async getInitialProps(props) {
        try {
            const campaign = Campaign(props.query.address);
            const campaignSummary = await campaign.methods.getCampaignSummary().call();
            return {
                minContribution: campaignSummary[0],
                balance: campaignSummary[1],
                totalRequests: campaignSummary[2],
                totalContributors: campaignSummary[3],
                manager: campaignSummary[4],
                campaignAddress: props.query.address
            };
        }
        catch (err) {
            return { err: err };
        }
    }

    renderCards() {
        const {
            minContribution,
            balance,
            totalRequests,
            totalContributors,
            manager
        } = this.props;

        const items = [
            {
                header: <span
                    className="header"
                    style={{
                        whiteSpace: 'nowrap',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >{manager}</span>,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                //style: { overflowWrap: 'break-word' }
            },
            {
                header: minContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least the given amount to become a contributor.'
            },
            {
                header: totalRequests,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the contract. A request can be approved by the contributors.'
            },
            {
                header: totalContributors,
                meta: 'Number of Contributors',
                description: 'Number of users who have already donated to this contract.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            }
        ];

        return <Card.Group items={items} />
    }

    render() {
        if (this.props.err) {
            //Error handling if query is wrongly entered
            return <ErrorPage statusCode={404} />
        }

        return (
            <Layout>
                <div className="showCampaign">
                    <h1>Campaign Details</h1>
                    <Grid>
                        <Grid.Column
                            width={9}
                            style={{ marginBottom: '1em' }}
                        >
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a>
                                    <Button primary style={{ marginBottom: '1em' }}>
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={7} mobile={5}>
                            <ContributeForm address={this.props.campaignAddress} />
                        </Grid.Column>
                    </Grid>
                </div>
            </Layout >
        );
    }
}

export default ShowCampaign;