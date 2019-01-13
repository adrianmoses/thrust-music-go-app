import React from 'react';
import PropTypes from 'prop-types';

class EmptyLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        return (
            <div className="page-container">
                {this.props.children}
            </div>
        );
    }
}

export { EmptyLayout };