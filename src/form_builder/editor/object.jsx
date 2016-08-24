import React from 'react';
import Form from 'react-jsonschema-form';

const schema = {
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
      }
    }
  }
}

class Editor extends React.Component {
  onChange(e){
    this.props.onChange(e,e.formData);
  }
  render(){
    console.log('===========;;;;=========');
    console.log(this.props);

    const node = this.props.node;
    const props = Object.assign(
      {},
      this.props, {
        schema:schema,
        formData:node,
        onChange:this.onChange.bind(this)
      }
    );
    return (<Form {...props} />);
  }
}

export default {
  filter: ({configs})=>(configs.type=="object" || configs.type=="array"),
  component: Editor
}
