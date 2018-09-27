import React from 'react';
import classNames from 'classnames';


export default class DropdownNav extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let _classes = classNames("dropdown-list", {
            hide: this.props.hide
        })
        return (
            <div className="dropdown-nav">
                <div className={_classes}>
                    <div className="arrow-up"></div>
                    <div style={{width: "100px"}}>
                        {this.props.items}
                    </div>
                </div>
            </div>
        )
    }
}