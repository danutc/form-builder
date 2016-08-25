import React from 'react';
import Form from 'react-jsonschema-form';
import common from './_common';
import deepmerge from 'deepmerge';
const schema = deepmerge(common,{
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'configs': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string'
        },
        'enum': {
          'type': 'array',
          'items': {
            'type': 'string'
          }
        },
        'enumNames': {
          'type': 'array',
          'items': {
            'type': 'string'
          }
        },
        'validate':{ type: 'array',title:'Validate',items:{
          type:'object',
          properties:{
            clause:{type:'string',title:'Clause'},
            message:{type:'string',title:'Message'}
          }
        }}
      }
    },
    'ui': {
      'type': 'object',
      'properties': {
        'ui:widget': {
          'type': 'string'
        }
      }
    }
  }
});

class Editor extends React.Component {
  onChange(e){
    this.props.onChange(e,e.formData);
  }
  render(){
    const node = this.props.node;
    const props = Object.assign(
      {},
      this.props, {
        schema:schema,
        formData:node,
        onChange:this.onChange.bind(this),
      }
    );
    return (<Form {...props} />);
  }
}

export default {
  filter:({configs})=>(configs.type=='string' && Array.isArray(configs.enum)),
  component: Editor
};
