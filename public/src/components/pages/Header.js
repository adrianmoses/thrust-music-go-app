import React from 'react';
import { Layout, Button, Icon } from 'antd';
const { Header } = Layout;

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoSavedTime: ''
        }
    }
    render() {
        return (
            <Header className="header">
              <span className="preview-section">
                <Button>
                  <Icon type="desktop" /> Preview
                </Button>
              </span>
              <span className="save-section">
                <span className="auto-saved">
                  {this.state.autoSavedTime}
                </span>
                <Button className="success-button">Save</Button>
              </span>
            </Header>
        )
    }
}

export default HeaderComponent;