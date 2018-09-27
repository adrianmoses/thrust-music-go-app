import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import React from 'react';

var styles = {
    fullStyles: {
        background: "#6CA6C1",
        boxSizing: "border-box",
        color: "#FDFFFC"
    },
    backgroundStyles: {
        backgroundImage: null,
        backgroundSize: "cover",
        height: "100%",
        display: "flex",
    },
    mainSection: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        display: "-ms-flexbox",
        display: "-webkit-flex",
    },
    headline: {
        fontSize: "36px",
        textAlign: "center",
        alignItems: "center",
    },
    subHeadline: {
        width: "55%",
        textAlign: "center",
        fontSize: "18px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    form: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
    },
    input: {
        flexDirection: "row",
        width: "50%",
        marginTop: "20px",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        height: "30px"
    },
    button: {
        width: "50%",
        background: "#343434",
        flexDirection: "row",
        marginTop: "20px",
        height: "30px",
        border: "none",
        borderRadius: "5px",
    }
};

export default class EmailForDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles,
            title: Plain.deserialize("Glue"),
            subHeadline: Plain.deserialize("Sign up for the Mars Moses mailing list and receive an MP3 download of Glue"),
        }
    }
    componentDidMount() {
        let { backgroundStyles } = this.state.styles
        if (this.props.backgroundImage && backgroundStyles.backgroundImage !== this.props.backgroundImage) {
          let stylesState = {...this.state.styles}
          stylesState.backgroundStyles.backgroundImage = `url(${this.props.backgroundImage})`;
          this.setState((state, props) => {
              return {
                stylesState,
              }
          })
        }
    }
    componentDidUpdate() {
        let { backgroundStyles } = this.state.styles
        if (this.props.backgroundImage && backgroundStyles.backgroundImage !== this.props.backgroundImage) {
            let stylesState = {...this.state.styles}
            stylesState.backgroundStyles.backgroundImage = `url(${this.props.backgroundImage})`;
            this.setState((state, props) => {
                return {
                  stylesState,
                }
            })
        }
    }
    onTitleChange({ state }) {
        let editorState = state;
        this.setState((state, props) => {
            return { title: editorState }
        })
    }
    onSubHeadlineChange({ state }) {
        let editorState = state;
        this.setState((state, props) => {
            return { subHeadline: editorState }
        })
    }
    render() {
        return (
            <div 
                style={this.state.styles.fullStyles}
                className="template-section">
                <div style={this.state.styles.backgroundStyles}>
                    <div style={this.state.styles.mainSection}>
                        <div style={this.state.styles.headline}>
                            <Editor
                                state={this.state.title}
                                onChange={this.onTitleChange.bind(this)}
                              />
                        </div>
                        <div style={this.state.styles.subHeadline}>
                            <Editor
                                state={this.state.subHeadline}
                                onChange={this.onSubHeadlineChange.bind(this)}
                              />
                        </div>
                        <form 
                            style={this.state.styles.form}
                            name="contact"
                            method="post"
                            action="/">
                            <input style={this.state.styles.input} name="email" placeholder="Email Address" />
                            <button style={this.state.styles.button} name="button">Download</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}