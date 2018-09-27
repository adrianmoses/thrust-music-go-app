import React from 'react';

class EmptyLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: React.PropTypes.node,
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