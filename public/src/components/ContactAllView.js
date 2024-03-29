import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import * as actionCreators from '../actions/auth';
import PropTypes from 'prop-types';

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


const TextCell = ({rowIndex, data, col, ...props}) => {
    return (
        <Cell {...props}>
            {data[rowIndex][col]}
        </Cell>
    )
}

@connect(mapStateToProps, mapDispatchToProps)
class ContactAllView extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        // this.props.fetchProtectedData(token);
    }
    render() {
        const {dataList} = this.state;
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
                                New Contact
                            </div>
                            <div className="section-nav__left">
                                <ul>
                                    <li>
                                        <a href="/contacts">Overview</a>
                                    </li>
                                    <li>
                                        All
                                    </li>
                                </ul>
                            </div>
                            <div className="section-nav__right">
                                <ul>
                                    <li>
                                        <a href="/contacts/new">New</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <ReactTable 
                                data={dataList}
                                columns={columns}
                                showPagination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContactAllView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};
export default ContactAllView;
