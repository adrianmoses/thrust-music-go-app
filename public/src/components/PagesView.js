import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import { Link } from 'react-router';
import Button from '../lib/Button';
import { browserHistory } from 'react-router';


function mapStateToProps(state) {
    return {
        data: state.page,
        pages: state.page,
        token: state.auth.token,
        loaded: state.page.loaded,
        isFetching: state.page.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.pageActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class PagesView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {}
    }
    openPageEditor(e) {
      browserHistory.push('/pages/edit')
    }
    render() {
        return (
            <div>
                <div className="section">
                    <div className="overlay">
                        <div className="section-nav">
                            <div className="section-nav__brand">
                                Pages
                            </div>
                            <div className="section-nav__left">
                            </div>
                            <div className="section-nav__right">
                                 <Button
                                      onClick={(e) => this.openPageEditor(e)}
                                      floatRight
                                      positive>
                                    New Page
                                </Button>
                            </div>
                        </div>
                        <div className="card">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PagesView;