import React from 'react';
import Form from 'react-jsonschema-form';
import deepmerge from 'deepmerge';
import deepcopy from 'deepcopy';
import common from './_common.js';
const schema = deepmerge(deepcopy(common),{
  properties:{
    configs:{
      properties:{
        conditional:{
          type:'array',
          title:'Conditional Logic',
          items:{
            type:'object',
            title:'Condition',
            properties:{
              clause:{
                title:'Tester',
                type:'string'
              },
              properties:{
                type:'array',
                items:{
                  type:'string'
                }
              }
            }
          }
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
        onChange:this.onChange.bind(this)
      }
    );
    return (<Form {...props} />);
  }
}

export default {
  filter: ({configs})=>(configs.type=='object' || configs.type=='array'),
  component: Editor
};
