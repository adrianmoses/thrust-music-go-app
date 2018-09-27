import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../actions/auth';
import PropTypes from 'prop-types';
import LineChart from '../lib/LineChart';
import CircleChart from '../lib/CircleChart';
import Dropdown from '../lib/Dropdown';

import AudienceTable from './AudienceTableView';
import EngagementTable from './EngagementTableView';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
        data: state.user,
        token: state.auth.token,
        loaded: state.user.loaded,
        isFetching: state.user.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const styles = {
  paper: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  title: {
    textAlign: "center"
  },
};


@connect(mapStateToProps, mapDispatchToProps)
class DashboardView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {
                name: "twitter",
                social: "twitter-icon" 
            },
            items: [
              {
                name: "facebook",
                social: "facebook-icon"
              },
              {
                name: "youtube",
                social: "youtube-icon"
              },
              {
                name: "twitter",
                social: "twitter-icon",
              },
            ],
        };
    }

    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const token = this.props.token;
        // this.props.fetchProtectedData(token);
    }
    updateActiveItem(selectedItem) {
        this.setState((state, props) => {
          return {activeItem: selectedItem}
        })
    }
    render() {
        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Dashboard
                            </div>
                        </div>
                        <div className="section-nav__left">
                            <Dropdown
                               defaultSelected={this.state.activeItem}
                               items={this.state.items}
                               onChange={this.updateActiveItem.bind(this)}
                              />
                        </div>
                        <div className="card" style={{width: "auto"}}>
                            <LineChart />
                            <CircleChart />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Audience
                            </div>
                        </div>
                        <div className="card">
                            <AudienceTable />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Engagement
                            </div>
                        </div>
                        <div className="card">
                            <EngagementTable />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Page Analytics
                            </div>
                        </div>
                        <div className="card disabled">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DashboardView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
export default DashboardView;