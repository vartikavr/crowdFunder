import { Component } from 'react';
import Layout from "../../../components/layout";
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errMessage: '',
        success: false
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    handleSubmit = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;
        this.setState({ loading: true, success: false, errMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts();
            const campaignSummary = await campaign.methods.getCampaignSummary().call();
            if (campaignSummary[1] < web3.utils.toWei(value, 'ether')) {
                throw new Error('Value exceeding the balance of contract.')
            }
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({
                from: accounts[0]
            });
            this.setState({ loading: false, success: true })
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        }
        catch (err) {
            this.setState({ errMessage: err.message, success: false, loading: false })
        }
    }

    render() {
        return (
            <div className="requestNew">
                <Layout>
                    <Link route={`/campaigns/${this.props.address}/requests`}>
                        <a style={{ textDecoration: 'underline' }}>
                            <h5>Back to requests</h5>
                        </a>
                    </Link>
                    <h1>New Request</h1>
                    <Form onSubmit={this.handleSubmit} error={this.state.errMessage} success={this.state.success}>
                        <Form.Field>
                            <label><h5>Description</h5></label>
                            <Input
                                value={this.state.description}
                                onChange={event => this.setState({ description: event.target.value })}
                                placeholder="Enter description"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label><h5>Value (in ether)</h5></label>
                            <Input
                                value={this.state.value}
                                onChange={event => this.setState({ value: event.target.value })}
                                placeholder="Enter value"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label><h5>Recipient Address</h5></label>
                            <Input
                                value={this.state.recipient}
                                onChange={event => this.setState({ recipient: event.target.value })}
                                placeholder="Enter recipient address"
                            />
                        </Form.Field>
                        <Message error
                            header="An error occured!"
                            content={this.state.errMessage}
                        />
                        <Message success
                            header="Successfully created a new request!"
                        />
                        <Button primary loading={this.state.loading}>
                            Create
                        </Button>
                    </Form>
                </Layout>
            </div>
        );
    }
}

export default RequestNew;