import { Component } from 'react';
import Layout from '../../../components/layout';
import { Button, Table, Icon, Message } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/requestRow';
import { Router } from '../../../routes';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;

        const campaign = Campaign(address);
        const totalRequests = await campaign.methods.getRequestsCount().call();
        const totalContributors = await campaign.methods.contributorCount().call();
        const requests = await Promise.all(
            //The Promise.all() method takes an iterable of promises as an input, 
            //and returns a single Promise that resolves to an array of the results of the input promises.
            Array(parseInt(totalRequests))
                .fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );

        return { address, requests, totalRequests, totalContributors }; //es6 syntax => equivalent to {address: address}
    }

    state = {
        error: false,
        success: false,
        message: ''
    };

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                controls={this.controls}
                key={index}
                id={index}
                request={request}
                totalContributors={this.props.totalContributors}
                address={this.props.address}
            />;
        })
    }

    controls = (error, success, message) => {
        this.setState({ error, success, message });
        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        const { error, success, message } = this.state;

        const msgItems = [
            'A request can only be approved by the contributors of the campaign.',
            'A request can only be added and finalized by the manager of the campaign.'
        ]

        return (
            <div className="requestsIndex">
                <Layout>
                    <Link route={`/campaigns/${this.props.address}`}>
                        <a style={{ textDecoration: 'underline' }}>
                            <h5 style={{ marginBottom: '1em' }}>Back to Campaign details</h5>
                        </a>
                    </Link>
                    <div className="requestHeader">
                        <h2 style={{ display: 'inline-block' }}>All Requests</h2>
                        <Link route={`/campaigns/${this.props.address}/requests/new`}>
                            <a>
                                <Button
                                    primary
                                    floated="right"
                                >
                                    Add request
                            </Button>
                            </a>
                        </Link>
                    </div>
                    <Message
                        info
                        style={{ overflowWrap: 'break-word' }}
                    >
                        <Message.Header>Important!</Message.Header>
                        <Message.List items={msgItems} />
                    </Message>
                    {success
                        ?
                        <Message
                            style={{ textAlign: 'center' }}
                            success={success}
                            header={message}
                        />
                        : null
                    }
                    {error
                        ?
                        <Message
                            style={{ textAlign: 'center', overflowWrap: 'break-word' }}
                            error={error}
                            header="An error occured!"
                            content={message}
                        />
                        : null
                    }
                    <Table>
                        <Header>
                            <Row>
                                <HeaderCell>ID</HeaderCell>
                                <HeaderCell>Description</HeaderCell>
                                <HeaderCell><Icon name="ethereum" />Amount</HeaderCell>
                                <HeaderCell>Recipient</HeaderCell>
                                <HeaderCell>Approval Count</HeaderCell>
                                <HeaderCell>Approve</HeaderCell>
                                <HeaderCell>Finalize</HeaderCell>
                            </Row>
                        </Header>
                        <Body>
                            {this.renderRows()}
                        </Body>
                    </Table>
                    <p>Found {this.props.totalRequests} requests.</p>
                </Layout>
            </div >
        );
    }
}

export default RequestIndex;