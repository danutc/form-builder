import React from 'react';
import Form from 'react-jsonschema-form';

import ObjectEditor from './editor/object';
import RadioEditor from './editor/radio';
import BooleanInputEditor from './editor/boolean_input';
import NumberInputEditor from './editor/number_input';
import StringInputEditor from './editor/string_input';
import DefaultEditor from './editor/default';
import ConditionalObject from './editor/conditional_object.js';

const editors = [
  ConditionalObject,
  RadioEditor,
  ObjectEditor,
  StringInputEditor,
  BooleanInputEditor,
  NumberInputEditor,
  DefaultEditor,
];

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
      {node}
    );
    return (<AvailableEditor {...props}/>);
  }
}

export default Editor2;
