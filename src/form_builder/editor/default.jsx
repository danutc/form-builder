import React from 'react';
import Form from 'react-jsonschema-form';


const schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "configs": {
      "type": "string"
    },
    "ui": {
      "type": "string"
    }
  }
};

const uiSchema = {
  "configs": {
    "ui:widget": "textarea"
  },
  "ui": {
    "ui:widget": "textarea"
  }
}

const Editor = React.createClass({
  onChange(e){
    let configs = JSON.parse(e.formData.configs);
    let ui = JSON.parse(e.formData.ui);
    let new_data = {
      name: e.formData.name,
      configs,
      ui
    };
    new_data.ui = ui;
    this.props.onChange(e, new_data);
  },
  render() {
    //const {onChange} = this.props;
    //const node = this.props.getActiveNode();
    const node = this.props.node;
    if(!node)  return null;

    const formData = {
      name: this.props.node.name,
      configs: JSON.stringify(this.props.node.configs, null, '  '),
      ui:  JSON.stringify(this.props.node.ui, null, '  ')
    }
    console.log('==========!');
    console.log(formData);
    console.log(this.props.node);
    const props = Object.assign(
      {},
      this.props,
      {schema,uiSchema,formData,onChange:this.onChange}
    );
    return <Form {...props} />
  }
});

export default {
  filter: ()=>true,
  component: Editor
}
