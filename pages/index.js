import factory from '../ethereum/factory';
import { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/layout';
import { Link } from '../routes';

class Index extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns: campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(
            address => {
                return {
                    header: address,
                    description: (
                        <Link route={`/campaigns/${address}`}>
                            <a>View Campaign</a>
                        </Link>
                    ),
                    style: { overflowWrap: 'break-word' },
                    fluid: true //takes up the width of the container
                };
            });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            //Campaign list will be child of Layout
            <Layout>
                <div>
                    <h3>All Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add circle"
                                primary={true}
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default Index;