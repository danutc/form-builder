import React, { Component } from 'react';
import { render } from 'react-dom';


import FormBuilder from '../src/form_builder/index';
import custom from 'form-custom-components';
import preset from './preset';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-ui-tree/dist/react-ui-tree.css';
import './main.css';
/*
const formSchema = {
                    schema:{
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
                    },
                    uiSchema:{
                      "age": {
                        "ui:widget": "updown"
                      },
                      "bio": {
                        "ui:widget": "textarea"
                      },
                      "password": {
                        "ui:widget": "password",
                        "ui:help": "Hint: Make it strong!"
                      },
                      "date": {
                        "ui:widget": "alt-datetime"
                      }
                    }
                  }
*/
const formSchema = {
  schema:{
    "type": "object",
    "conditional": [
      {
        "clause": "this.switch==\"case1\"",
        "properties": [
          "case_1",
          "other"
        ]
      },
      {
        "clause": "this.switch==\"case2\"",
        "properties": [
          "case_2"
        ]
      }
    ],
    "properties": {
      "switch": {
        "type": "string",
        "enum": [
          "case1",
          "case2"
        ]
      },
      "case_1": {
        "type": "string",
        "default": "case1"
      },
      "case_2": {
        "type": "string",
        "default": "case2"
      },
      "other": {
        "type": "string",
        "title": "Input"
      }
    }
  },
  uiSchema:{}
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  onSubmit(formSchema){
    console.log(formSchema);
  }
  render(){
    console.log('====================');
    console.log(custom);
    return (<FormBuilder
                preset={preset}
                widgets={custom.widgets}
                fields={custom.fields}
                onSubmit={this.onSubmit}
                formName={"developing"}
                formSchema={formSchema}
            />);
  }
}

console.log('asdf');
render(<App />, document.getElementById('app'));
console.log('asdf==');
