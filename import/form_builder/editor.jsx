import React from 'react';
import Form from 'react-jsonschema-form';

//--------------------------------------------------------------------------------
// Json scheme editor properties
//--------------------------------------------------------------------------------
var commonEditFormSchema = {
    type: 'object',

    properties: {
        label: { type: 'string', title: 'Label' },
        class: { type: 'string', title: 'Class' },
        name: { type: 'string', title: 'Name' },
        defaultValue: { type: 'string', title: 'Default Value' },
        placeHolder: { type: 'string', title: 'Place Holder' },
        hint: { type: 'string', title: 'Hint' },
    }
}

//--------------------------------------------------------------------------------
// UI schema editor properties
//--------------------------------------------------------------------------------

let uiFormEditorSchema = {
    "type": 'object',
    "title": 'UI Widget Configuration',
    "properties": {
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
    }

    onChange(e) {
        console.log('changed');
    }

    render() {
        const node = this.props.getActiveNode();

        console.log(node);

        if (!node) {
            return null;
        }

        let uiSchema = Object.assign({}, uiFormEditorSchema, { properties: uiEditPropertiesSchema[node.configs.type] });
        console.log(uiSchema);

        return (
            <div className="form-editor">
                <Editor schema={ commonEditFormSchema } node={ node } onChange={ this.onChange.bind(this) } />
                <Editor schema={ uiSchema }  node={ node } onChange={ this.onChange.bind(this) } />
            </div>
        );
    }
};

export default EditorContainer;
