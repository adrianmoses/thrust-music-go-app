import React, { Component } from 'react';

// import 'antd/dist/antd.css'
import './styles/index.css';

// import { Layout } from 'antd';

// // components
// import Sidebar from '../../components/pages/Sidebar';
// import Header from '../../components/pages/Header';
// import Content from '../../components/pages/Content';

// // templates
// import NoTemplate from '../../components/pages/templates/NoTemplate';
// import EmailForDownload from '../../components/pages/templates/EmailForDownload';
// import PhoneForDownload from '../../components/pages/templates/PhoneForDownload';
// import AudioEmbed from '../../components/pages/templates/AudioEmbed';
// import VideoEmbed from '../../components/pages/templates/VideoEmbed';

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoSavedTime: '',
      backgroundImage: null,
      // templateComponent: EmailForDownload 
    }
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
    return (
      <div className="page-container">
        <h1>Welcome To Pages!</h1>
      </div>
    );
  }
}

export default Page;
