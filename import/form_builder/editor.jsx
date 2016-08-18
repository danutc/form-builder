import React from 'react';
import Form from 'react-jsonschema-form';
var commonEditFormSchema = {
    type: 'object',
    title: 'General',

    properties: {
        label: { type: 'string', title: 'Label' },
        class: { type: 'string', title: 'Class' },
        name: { type: 'string', title: 'Name' },
        defaultValue: { type: 'string', title: 'Default Value' },
        placeHolder: { type: 'string', title: 'Place Holder' },
        hint: { type: 'string', title: 'Hint' },
        depth: { type: 'number', title: 'Depth of the element' }
    }
}

const JSONSchemaEditor = React.createClass({
    render(){
        return (<div></div>);
    }
});

const UISchemaEditor = React.createClass({
    render(){
        return (<div></div>);
    }
});

const GeneralEditor = React.createClass({
    getInitialState() {
        console.log('editor==========');
        console.log(this.props);
        return {
        }
    },

    onChange(e){
        console.log(e);
        //formData = e.formData;
        //this.setState.formData(this.props.formData);
        this.props.onChange(e,e.formData);
    },

    render(){
        const schema={
            "type": "object",
            "title": "General Editor",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "configs": {
                    "type": "object",
                    "title": "JSONSchema",
                    "properties": {
                        "type": {
                            "type": "string",
                            "title": "Input",
                            "enum": [
                                "object",
                                "array",
                                "integer",
                                "string",
                                "boolean"
                            ]
                        },
                        "title": {
                            "type": "string",
                            "title": "Label"
                        },
                        "default": {
                            "type": "string",
                            "title": "Default Value"
                        }
                    }
                },
                "ui": {
                    "type": "object",
                    "title": "UISchema",
                    "properties": {
                        "classNames": {
                            "type": "string",
                            "title": "Class"
                        },
                        "placeHolder": {
                            "type": "string",
                            "title": "Place Holder"
                        },
                        "hint": {
                            "type": "string",
                            "title": "Hint"
                        }
                    }
                }
            }
        };
        const node = this.props.getActiveNode();
        if(!node) return null;
        return (<Form
                    schema = {schema}
                    uiSchema = {this.state.uiSchema}
                    onChange = {this.onChange}
                    formData = {this.props.getActiveNode()}
                />)
    }

});

const Editor = React.createClass({
    onChange(e){
        let ui = JSON.parse(this.refs.uiEditorRef.value);
        let new_data = {
            name: this.refs.nameRef.value,
            configs: JSON.parse(this.refs.configsRef.value),
            ui: JSON.parse(this.refs.uiEditorRef.value),
        };
        new_data.ui = ui;
        this.props.onChange(e, new_data);
    },
    render() {
        //const {onChange} = this.props;
        const node = this.props.getActiveNode();
        if(!node)  return null;
        return (<div>
            <input ref="nameRef" type="text" value={node.name} onChange={this.onChange} />
            <textarea
                ref="configsRef"
                value={JSON.stringify(node.configs||{}, null, '  ')}
                onChange={this.onChange}>
            </textarea>
            <textarea
                ref="uiEditorRef"
                value={JSON.stringify(node.ui||{}, null, '  ')||{}}
                onChange={this.onChange}>
            </textarea>
        </div>);
    }

});

export default Editor;
