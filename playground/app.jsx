import React, { Component } from 'react';
import { render } from 'react-dom';


import FormBuilder from '../src/form_builder/index';
import custom from '../src/custom';
import preset from './preset';


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
                formSchema={{
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
                  }}


            />);
  }
}

console.log('asdf');
render(<App />, document.getElementById('app'));
console.log('asdf==');
