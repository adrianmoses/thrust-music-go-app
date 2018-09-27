import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

class ContentComponent extends React.Component {
    render() {
        let { TemplateComponent } = this.props;
        return (
            <Content className="content">
                <TemplateComponent 
                    backgroundImage={this.props.backgroundImage}/>
            </Content>
        )
    }
}

export default ContentComponent;