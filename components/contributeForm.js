import { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = (props) => {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);
        setErrMessage('');

        try {
            if (parseFloat(value) === 0 || parseFloat(value) < 0) {
                throw new Error('Please enter more than 0 ether!')
            }
            const campaign = Campaign(props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            setIsSuccess(true);
            setIsLoading(false);
            setValue('');
            Router.replaceRoute(`/campaigns/${props.address}`);
        }
        catch (error) {
            setIsLoading(false);
            setIsSuccess(false);
            setErrMessage(error.message);
        }
    }

    return (
        <div className="contributeForm">
            <Form onSubmit={handleSubmit} error={errMessage} success={isSuccess}>
                <Form.Field>
                    <label><h5>Amount to contribute</h5></label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        placeholder="Enter value"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                </Form.Field>
                <Message error
                    header="An error occured!"
                    content={errMessage}
                    style={{ overflowWrap: 'break-word' }}
                />
                <Message success
                    header="Successfully contributed to this contract!"
                />
                <Button loading={isLoading} primary>
                    Contribute
                </Button>
            </Form>
        </div>
    );
}

export default ContributeForm;