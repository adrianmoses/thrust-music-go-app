import React from 'react';
/* application components */
import { HeaderView } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import 'antd/lib/icon/style/css';
import 'antd/lib/menu/style/css';
import 'antd/lib/dropdown/style/css';
import 'antd/lib/date-picker/style/css';
// import 'antd/dist/antd.css';
import './styles/app.scss';


class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: React.PropTypes.node,
    };

    render() {
        return (
            <div>
                <div className="app-container">
                    {
                        this.props.location.pathname === '/register' || this.props.location.pathname === '/login'
                        ?
                        null
                        :
                        <HeaderView location={this.props.location}/>
                    }
                    <div className="main">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export { App };
