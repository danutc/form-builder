import App2 from '../import/form_builder/index.jsx';
import React from 'react';
import { render } from 'react-dom';
import preset from './preset.js'
import Form from 'react-jsonschema-form';
import "../node_modules/react-ui-tree/dist/react-ui-tree.css";

const Editor = React.createClass({
    getInitialState() {
        return {
            schema:{},
            uiSchema:{}
        }
    },
    onChange(){

    },
    render(){
        return (<Form
            schema = {this.state.schema}
            uiSchema = {this.state.uiSchema}
            onChange = {this.onChange}
        />)
    }

});

const App = React.createClass({
    getInitialState() {
        return {
            schema:{},
            uiSchema:{}
        }
    },

    onChange(){
        this.setState({
            schema:JSON.parse(this.refs.schemaRef.value),
            uiSchema:JSON.parse(this.refs.uiSchemaRef.value),
        });
    },

    onFormData(e){
        console.log('--------------------');
        console.log(e);
    },

    render (){
        const schema={
            "title": "A registration form",
            "description": "A simple form example.",
            "type": "object",
            "required": [
                "firstName",
                "lastName"
            ],
            "properties": {
                "firstName": {
                    "type": "string",
                    "title": "First name"
                },
                "lastName": {
                    "type": "string",
                    "title": "Last name"
                },
                "age": {
                    "type": "integer",
                    "title": "Age"
                },
                "bio": {
                    "type": "string",
                    "title": "Bio"
                },
                "password": {
                    "type": "string",
                    "title": "Password",
                    "minLength": 3
                }
            }
        };
        return (<div className="app">
            <Form
                schema={schema}
                onChange={this.onFormData} />
            <hr />

            <hr />
            <div className="inspector">
                <textarea
                    ref="schemaRef"
                    value={JSON.stringify(this.state.schema)}
                    onChange={this.onChange}>
                </textarea>
                <textarea
                    ref="uiSchemaRef"

                    value={JSON.stringify(this.state.uiSchema)}
                    onChange={this.onChange}>
                </textarea>
                <hr />
                <textarea
                    ref="treeRef"
                    value={JSON.stringify(this.state.tree, null, '  ')}
                    onChange={this.updateSchema}>
                </textarea>
            </div>
        </div>)
    },
});

Meteor.startup(() => {
    console.log(preset);
    render(<App2 preset={preset}/>, document.getElementById('app'));
});
