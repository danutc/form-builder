import React from 'react';
import Form from 'react-jsonschema-form';

//--------------------------------------------------------------------------------
// Json scheme editor properties
//--------------------------------------------------------------------------------
var commonEditFormSchema = {
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
}

//--------------------------------------------------------------------------------
// UI schema editor properties
//--------------------------------------------------------------------------------

let uiFormEditorSchema = {
    "type": 'object',
    "title": 'UI Widget Configuration',
    "properties": {
        "classNames": { type: 'string', title: 'Class' },
        "ui:placeholder": {type: 'string', title: 'Place holder'},
        "ui:help": {type: 'string', title: 'Hint'},
    }
}

let uiEditPropertiesSchema = {
    'integer': {
        "ui:widget": {
            "type": "number",
            "title": 'type',
            "enum": [
                "updown",
                "range"
            ]
        }
    },
    'string': {
        "ui:widget": {
            "type": "string",
            "title": 'type',
            "enum": [
                "input",
                "textarea"
            ]
        }
    }

}

//--------------------------------------------------------------------------------
// Editor Components
//--------------------------------------------------------------------------------
class Editor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { node, onChange, schema } = this.props;

        return (
            <Form
                schema = { schema }
                onChange = { onChange }
                formData = { node }
          ><button hidden></button></Form>
        )
    }
}


class EditorContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onChangeUi = this.onChangeUi.bind(this);
    }

    onChangeUi(e) {
        let { formData } = e;
        // rearrange the configs since the form data is mixed up with the configs at
        // this moment
        let new_data = {
            ui: formData,
        };
        this.props.onChange(e, new_data);
    }

    onChange(e) {
        let { formData } = e;
        // rearrange the configs since the form data is mixed up with the configs at
        // this moment
        let new_data = {
            configs: formData,
        };
        this.props.onChange(e, new_data);
    }

    render() {
        const node = this.props.getActiveNode();

        if (!node) {
            return null;
        }

        let properties = uiEditPropertiesSchema[node.configs.type];
        let uiComponent = (null);

        if (properties) {

            // rebuild ui schema
            let common_properties = uiFormEditorSchema.properties;
            let props = {...properties, ...common_properties};

            let uiSchema = {
                'type': 'object',
                properties: props
            };

            let { ui } = node;

            uiComponent = (<Editor schema={ uiSchema }  node={ ui } onChange={ this.onChangeUi} />);
        }
        return (
            <div className="form-editor">
                <Form schema={{type:'string',title:'Name'}} formData={node.name} onChange={(e)=>{console.log(name) ;this.props.onChange(e,{name:e.formData}) }} ><button hidden></button></Form>
                <hr />
                <Editor schema={ commonEditFormSchema } node={ node.configs } onChange={ this.onChange } />
                <hr />
                {uiComponent}
            </div>
        );
    }
};

export default EditorContainer;
