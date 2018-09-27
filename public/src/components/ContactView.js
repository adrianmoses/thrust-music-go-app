import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../actions';
import PropTypes from 'prop-types';

import Flash from '../lib/Flash';
import { browserHistory } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
        data: state.contact,
        token: state.auth.token,
        loaded: state.contact.loaded,
        isFetching: state.contact.isFetching,
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


const TextCell = ({rowIndex, data, col, ...props}) => {
    return (
        <Cell {...props} style={{cursor: "pointer"}} onClick={(e) => {
            console.log('/contacts/'+data[rowIndex].id);
            browserHistory.push('/contacts/'+data[rowIndex].id)
        }}>
            {data[rowIndex][col]}
        </Cell>
    )
}

@connect(mapStateToProps, mapDispatchToProps)
class ContactView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            dataList: [
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
                {
                    name: "Mars Moses",
                    email: "iammarsmoses@gmail.com",
                    links: "http://twitter.com",
                    source: "Bandcamp",
                    tags: "[fan] [friend]",
                    notes: "has some good stuff. and is very nice"
                },
            ]
        }
    }

    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const token = this.props.token;
        this.props.fetchUserAndAllContactData(token);
    }
    openPage(route) {
        this.props.redirectToRoute(route);
    }
    render() {
        let data = this.props.data
        if (typeof data.data === 'undefined' || data.data === null) {
            data.data = {
                contacts: []
            }
        }
        const dataList = data.data.contacts;
        const columns = [
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Links',
                accessor: 'links'
            },
            {
                Header: 'Source',
                accessor: 'source'
            },
            {
                Header: 'Tags',
                accessor: 'tags'
            },
            {
                Header: 'Notes',
                accessor: 'notes'
            },
        ]

        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Contact
                            </div>
                            <div className="section-nav__left">
                                <ul>
                                    <li>
                                        <a onClick={(e) => this.openPage('/contacts') }>Overview</a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => this.openPage('/contacts/all') }>All</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="section-nav__right">
                                <ul>
                                    <li>
                                        <a onClick={(e) => this.openPage('/contacts/new') }>New</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <ReactTable 
                                data={dataList}
                                columns={columns}
                                showPagination={false}
                                getTrProps={(state, rowInfo, column) => {
                                    return {
                                        onClick: e => {
                                            browserHistory.push('/contacts/'+rowInfo.row._original.id);
                                        },
                                        style: {
                                            cursor: "pointer"
                                        }
                                    }
                                  }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContactView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
export default ContactView;
