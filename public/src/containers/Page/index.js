import React, { Component } from 'react';

import 'antd/dist/antd.css'
import './styles/index.css';

import { Layout } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

// components
import Sidebar from '../../components/pages/Sidebar';
import Header from '../../components/pages/Header';
import Content from '../../components/pages/Content';

// templates
import NoTemplate from '../../components/pages/templates/NoTemplate';
import EmailForDownload from '../../components/pages/templates/EmailForDownload';
import PhoneForDownload from '../../components/pages/templates/PhoneForDownload';
import AudioEmbed from '../../components/pages/templates/AudioEmbed';
import VideoEmbed from '../../components/pages/templates/VideoEmbed';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoSavedTime: '',
      backgroundImage: null,
      templateComponent: EmailForDownload 
    }
  }
  convertTemplateToString() {
      /*
        with react-data-id: ReactDOMServer.renderToString(element)
        without: ReactDOMServer.renderToStaticMarkup(element) 
        TODO: on save send string to server
        TODO: for preview send string to /preview/ID 
      */

  }
  componentDidMount() {
    let hash_id;
    if (this.props.location.pathname === '/edit') {
      hash_id = localStorage.getItem('pageHashId');
      if (!hash_id) {
        hash_id = this.alphanumericUnique();
        localStorage.setItem('pageHashId', hash_id);
      }
      this.props.history.push(`/edit/${hash_id}`)
    }
  }
  componentDidUpdate() {

  }
  alphanumericUnique() {
    return Math.random().toString(36).split('').filter( function(value, index, self) { 
        return self.indexOf(value) === index;
    }).join('').substr(2,8);
  }
  setBackground(imageFile){
    console.log("image file", imageFile);
    //TODO: set background image ??? 
    if (imageFile && this.state.backgroundImage !== imageFile) {
      this.setState((state, props) => {
        return {backgroundImage: imageFile}
      })
    }
  }
  render() {
    let TemplateComponent = this.state.templateComponent || NoTemplate;
    return (
        <Layout className="ant-layout-has-sider">
          <Sidebar 
              setBackground={(e) => this.setBackground(e)}
            />
          <Layout>
              <Header />
              <Content 
                backgroundImage={this.state.backgroundImage}
                TemplateComponent={TemplateComponent} />
          </Layout>
        </Layout>      
    );
  }
}

export default DragDropContext(HTML5Backend)(Page);
