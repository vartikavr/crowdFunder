import { Table, Label, Button, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { useState } from 'react';

const RequestRow = (props) => {
    const { Row, Cell } = Table;
    const readyTofinalize = (props.request.approvalCount) > (props.totalContributors / 2);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingFinalize, setLoadingFinalize] = useState(false);

    const handleApprove = async () => {
        setLoadingApprove(true);
        const { controls } = props;
        controls(false, false, '');
        try {
            const campaign = Campaign(props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(props.id).send({
                from: accounts[0]
            })
            setLoadingApprove(false);
            controls(false, true, 'Successfully approved the request!');
        }
        catch (err) {
            setLoadingApprove(false);
            controls(true, false, err.message);
        }
    }

    const handleFinalize = async () => {
        setLoadingFinalize(true);
        const { controls } = props;
        controls(false, false, '');
        try {
            const campaign = Campaign(props.address);
            const campaignSummary = await campaign.methods.getCampaignSummary().call();
            if (campaignSummary[1] < props.request.value) {
                setLoadingFinalize(false);
                controls(true, false, 'Request amount is exceeding campaign balance.')
            }
            else {
                const accounts = await web3.eth.getAccounts();
                await campaign.methods.finalizeRequest(props.id).send({
                    from: accounts[0]
                })
                setLoadingFinalize(false);
                controls(false, true, 'Successfully finalized the request!');
            }
        }
        catch (err) {
            setLoadingFinalize(false);
            controls(true, false, err.message);
        }
    }

    return (
        <Row disabled={props.request.complete} positive={readyTofinalize && !(props.request.complete)}>
            <Cell>
                <Label ribbon>{props.id}</Label>
            </Cell>
            <Cell>{props.request.description}</Cell>
            <Cell>{web3.utils.fromWei(props.request.value, 'ether')}</Cell>
            <Cell>{props.request.recipient}</Cell>
            <Cell>{props.request.approvalCount}/{props.totalContributors}</Cell>
            <Cell>
                {
                    props.request.complete
                        ?
                        (
                            <Icon color='green' name='checkmark' size='large' />
                        )
                        : <Button
                            loading={loadingApprove}
                            color="green"
                            basic
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                }
            </Cell>
            <Cell>
                {
                    props.request.complete
                        ?
                        (
                            <Icon color='green' name='checkmark' size='large' />
                        )
                        :
                        <Button
                            loading={loadingFinalize}
                            color="teal"
                            basic
                            onClick={handleFinalize}
                        >
                            Finalize
                    </Button>
                }
            </Cell>
        </Row>
    );
}

export default RequestRow;