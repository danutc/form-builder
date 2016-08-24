import React from 'react';
import Form from 'react-jsonschema-form';

const schema = {
  "type":"object",
  "properties":{
    "name":{
      "type":"string",
      "title":"Name"
    },
    "configs":{
      "type": 'object',
      "properties": {
        "title": { type: 'string', title: 'Label' },
        "default": { type: 'string', title: 'Default Value' },
        "validate":{ type: 'array',title:"Validate",items:{
          type:'object',
          properties:{
            clause:{type:'string',title:'Clause'},
            message:{type:'string',title:'Message'}
          }
        }}
      }
    },
    "ui":{
      "type":"object",
      "properties":{
        "ui:widget": {
          "type": "string",
          "title": 'type',
          "enum": [
            "default",
            "textarea"
          ]
        }
      }
    }
  }
}


class Editor extends React.Component {
  onChange(e){
    if(e.formData.ui['ui:widget']=='default'){
      delete e.formData.ui['ui:widget'];
    }
    this.props.onChange(e,e.formData);
  }
  render(){
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
  filter:({configs})=>(configs.type=="number" || configs.type=="integer"),
  component: Editor
}
