import Header from './header';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const Layout = (props) => {
    return (
        <Container>
            <Head>
                <title>CrowdFunder</title>
            </Head>
            <Header />
            {props.children}
            {/*Anything inside the Layout tag in pages->index.js file will act as property called children*/}
        </Container>
    );
}

export default Layout;