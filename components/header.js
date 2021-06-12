import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
    return (
        <Menu style={{
            marginTop: '1em',
            marginBottom: '1em',
        }}>
            <Link route="/">
                <div className="main-head">
                    <a className="item">CrowdFunder</a>
                </div>
            </Link>
            <Menu.Menu position='right'>
                <Link route="/">
                    <a className="item">Campaigns</a>
                </Link>
                <Link route="/campaigns/new">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;