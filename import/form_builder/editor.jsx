import React from 'react';
import Form from 'react-jsonschema-form';

//--------------------------------------------------------------------------------
// Json scheme editor properties
//--------------------------------------------------------------------------------
var commonEditFormSchema = {
    "type": 'object',
    "properties": {
        "title": { type: 'string', title: 'Label' },
        "name": { type: 'string', title: 'Name' },
        "default": { type: 'string', title: 'Default Value' },
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
        "placeHolder": {type: 'string', title: 'Place holder'},
        "hint": {type: 'string', title: 'Hint'},
    }
}

let uiEditPropertiesSchema = {
    'integer': {
        "type": {
            "type": "number",
            "enum": [
                "updown",
                "range"
            ]
        }
    },
    'string': {
        "type": {
            "type": "string",
            "enum": [
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
                />
        )
    }
}

class EditorContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
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
            let uiSchema = Object.assign({}, uiFormEditorSchema, {
                properties
            });

            let { ui } = node;

            uiComponent = (<Editor schema={ uiSchema }  node={ ui } onChange={ this.onChange } />);
        }

        return (
            <div className="form-editor">
                <Editor schema={ commonEditFormSchema } node={ node.configs } onChange={ this.onChange } />
                {uiComponent}
            </div>
        );
    }
};

export default EditorContainer;
