import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const templateItemSource = {
  beginDrag(props) {
    return {
      text: props.text,
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class TemplateItem extends Component {
    render() {
        const { isDragging, connectDragSource, text, iconElem } = this.props;
        return connectDragSource(
            <li 
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                    className="template-item">
                <div className="template-image">
                    {iconElem}
                </div>
                {text}
            </li>
        )
    }
    
}

TemplateItem.propTypes = {
  text: PropTypes.string.isRequired,
  iconElem: PropTypes.element,
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

export default DragSource('TEMPLATE', templateItemSource, collect)(TemplateItem);