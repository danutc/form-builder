import React from 'react';
import Form from 'react-jsonschema-form';

import common from './_common';
import deepmerge from 'deepmerge';
const schema = deepmerge(common,{
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
        "classNames":{
          "type":"string"
        },
        "ui:widget": {
          "type": "string",
          "title": 'widget',
          "enum": [
            "default",
            "textarea",
            "date",
            "dateTime",
            "file",
            "wysiwyg",
            "password",
            "color",
            "hidden"
          ],"enumNames":[
            "Text box",
            "Textarea",
            "Date",
            "Datetime",
            "File",
            "Wysiwyg",
            "Password",
            "Color",
            "Hidden"
          ]
        }
      }
    }
  }
});

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
  filter:({configs})=>(configs.type=="string" && !configs.enum),
  component: Editor
}
