import React from 'react';
import Form from 'react-jsonschema-form';
import deepmerge from 'deepmerge';
import common from './_common.js';
const schema = deepmerge(common,{
  'properties': {
    'ui':{
      'properties':{
        'ui:widget':{
          type:'string',
          enum:['default','select','radio','hidden']
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
  filter: ({configs})=>(configs.type=='boolean'),
  component: Editor
};
