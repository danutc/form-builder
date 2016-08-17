import App2 from '../import/form_builder/index.jsx';
import React , { Component }  from 'react';
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

class GeoPosition extends Component {
    constructor(props) {
        super(props);
        this.state = {...props.formData};
    }

    onChange(name) {
        return (event) => {
            this.setState({[name]: parseFloat(event.target.value)});
            setImmediate(() => this.props.onChange(this.state));
        };
    }

    render() {
        const {lat, lon} = this.state;
        return (
            <div className="geo">
                <h3>Hey, I'm a custom component</h3>
                <p>I'm registered as <code>geo</code> and referenced in
                    <code>uiSchema</code> as the <code>ui:field</code> to use for this
                    schema.</p>
                <div className="row">
                    <div className="col-sm-6">
                        <label>Latitude</label>
                        <input className="form-control" type="number" value={lat} step="0.00001"
                               onChange={this.onChange("lat")} />
                    </div>
                    <div className="col-sm-6">
                        <label>Longitude</label>
                        <input className="form-control" type="number" value={lon} step="0.00001"
                               onChange={this.onChange("lon")} />
                    </div>
                </div>
            </div>
        );
    }
}

Meteor.startup(() => {
    console.log(preset);
    render(<App2 preset={preset} fields={{geo:GeoPosition}}/>, document.getElementById('app'));
});
