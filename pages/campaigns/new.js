import { useState } from 'react';
import Layout from '../../components/layout';
import {
    Form,
    Button,
    Input,
    Message
} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const NewCampaign = () => {
    const [minContribution, setMinContribution] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setIsSuccess(false);
        setErrMessage('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minContribution).send({
                from: accounts[0]
                //gas value is not required to explicity mentioned by us here, when we're sending transactions from in the browser
                //metamask will automatically calculted the gas amount
            });
            setIsSuccess(true);
            setIsLoading(false);
            Router.pushRoute('/');
        }
        catch (error) {
            setIsLoading(false);
            setIsSuccess(false);
            setErrMessage(error.message);
        }
    }

    return (
        <Layout>
            <div className="newCampaign">
                <h3>Create a Campaign</h3>
                <Form onSubmit={handleSubmit} error={errMessage} success={isSuccess}>
                    <Form.Field style={{ maxWidth: '80%' }}>
                        <label>Minimum Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            placeholder="Enter value"
                            value={minContribution}
                            onChange={(event) => setMinContribution(event.target.value)}
                        />
                    </Form.Field>
                    <Message error
                        style={{ maxWidth: '80%' }}
                        header="An error occured!"
                        content={errMessage}
                    />
                    <Message success
                        style={{ maxWidth: '80%' }}
                        header="Successfully created a new contract!"
                    />
                    <Button loading={isLoading} primary>Submit</Button>
                </Form>
            </div>
        </Layout>
    );
}

export default NewCampaign;