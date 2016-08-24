import React from 'react';
import Form from 'react-jsonschema-form';

import ObjectEditor from './editor/object.jsx';
import RadioEditor from './editor/radio.jsx';
import StringInputEditor from './editor/string_input.jsx';
import DefaultEditor from './editor/default.jsx';

const editors = [
  RadioEditor,
  ObjectEditor,
  StringInputEditor,
  DefaultEditor,
];


const editorSchema = {
  "checkboxes": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "configs": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "enum": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "uniqueItems": {
            "type": "boolean"
          }
        }
      },
      "ui": {
        "type": "object",
        "properties": {
          "ui:widget": {
            "type": "string"
          }
        }
      }
    }
  }
}

class EditorContainer extends React.Component {
  onChange(e){
    this.props.onChange(e,e.formData);
  }
  render(){
    const node = this.props.getActiveNode();
    const props = Object.assign(
      {},
      this.props,
      {
        schema:editorSchema['checkboxes'],
        formData:node,
        onChange:this.onChange
      }
    );
    return (<Form {...props} />);
  }
}

class Editor2 extends React.Component {
  render(){
    const node = this.props.getActiveNode();
    const AvailableEditor = editors.find((editor)=>editor.filter(node)).component;
    const props = Object.assign(
      {},
      {...this.props},
      {node},
    );
    console.log('====================');
    console.log(this.props);
    return (<AvailableEditor {...props}/>);
  }
}

export default Editor2;
