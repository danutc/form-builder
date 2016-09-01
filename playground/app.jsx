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
  schema:{"type": "object","conditionFun": "function myCondition({schema, uiSchema, formData}) {\n  if (formData) {\n    function filterProps(props) {\n      let new_properties = {};\n      let new_data = {};\n      props.forEach(function(i) {\n        new_properties[i] = schema.properties[i];\n        new_data = formData[i];\n      });\n      let new_schema = Object.assign({}, schema);\n      new_schema.properties = new_properties;\n      return {\n        schema: new_schema,\n        uiSchema: uiSchema,\n        formData: formData\n      };\n    }\n    if (formData.switch == 'case1') {\n      let r = filterProps(['switch', 'case1']);\n      r.uiSchema.case1 = {\n        'ui:readonly': false\n      };\n      return r;\n    } else if (formData.switch == 'case2') {\n      let r = filterProps(['switch', 'case1', 'case2']);\n      r.uiSchema.case1 = {\n        'ui:readonly': true\n      };\n      return r;\n    } else {\n      return filterProps(['switch']);\n    }\n  }\n}", "properties": { "switch": { "type": "string", "enum": [ "case1", "case2" ] }, "case1": { "type": "string", "default": "case 1" }, "case2": { "type": "string", "default": "case 2" } } },
  uiSchema:{  "ui:field": "fullConditional"}
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
