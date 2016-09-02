import React, { Component } from 'react';
import { render } from 'react-dom';

import FormBuilder from '../src/form_builder/index';
import FormFactory from 'form-components/dist-component/client';
import fullConditional from '../src/fullConditional.js';

import Menu from "./CustomMenu.js";

let custom = {
  fields: {
    fullConditional,
    paymentStatus: FormFactory.createBuilder('cb-payment-status')
  },
  widgets: {
   dateTime: FormFactory.createBuilder('cb-datetime'),
   label: FormFactory.createBuilder('cb-label'),
   wysiwyg: FormFactory.createBuilder('cb-wysiwyg', {
     onChange: (value) => console.log(value)
   })
  }
}


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

function myCondition({schema, uiSchema, formData}) {

  if(formData){
    Object.keys(schema.properties).forEach(function(name){
      uiSchema[name]=uiSchema[name]||{};
    });
    if (formData.switch != 'case1') {
      uiSchema.case1['ui:widget']='hidden';
      formData.case1=undefined;
    }
    if (formData.switch != 'case2') {
      uiSchema.case1['ui:disabled']=true;
      uiSchema.case2['ui:widget']='hidden';
      formData.case2=undefined;
    }
    formData.sum = formData.a+formData.b;
  }
  return {schema, uiSchema, formData};
}

function myCondition2({schema, uiSchema, formData}) {
  if (formData) {
    function filterProps(props) {
      let new_properties = {};
      let new_data = {};
      props.forEach(function(i) {
        new_properties[i] = schema.properties[i];
        new_data = formData[i];
      });
      let new_schema = Object.assign({}, schema);
      new_schema.properties = new_properties;
      return {
        schema: new_schema,
        uiSchema: uiSchema,
        formData: formData
      };
    }
    let r;
    if (formData.switch == 'case1') {
      r = filterProps(['switch', 'case1','a','b','sum']);
      r.uiSchema.case1 = {
        'ui:readonly': false
      };
    } else if (formData.switch == 'case2') {
      let r = filterProps(['switch', 'case1', 'case2','a','b','sum']);
      r.uiSchema.case1 = {
        'ui:readonly': true
      };
    } else {
      r = filterProps(['switch','a','b','sum']);
    }
    r.formData['sum']=r.formData['a']+r.formData['b'];
    return r;
  }
}
const formSchema = {
  schema:{
    "type": "object",
    "conditionFun": myCondition.toString(),
    "properties": {
      "switch": {
        "type": "string",
        "enum": [ "case1", "case2" ]
      },
      "case1": {
        "type": "string", "default": "case 1"
      },
      "case2": {
        "type": "string", "default": "case 2"
      },
      "a":{
        "type":'number'
      },
      "b":{
        "type":'number'
      },
      "sum":{
        "title":'a+b',
        "type":'number'
      }
    }
  },
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
    console.log('end of custoemr');
    return (<FormBuilder
                menu={Menu}
                widgets={custom.widgets}
                fields={custom.fields}
                onSubmit={this.onSubmit}
                formName={"developing"}
                formSchema={formSchema}
            />);
  }
}

render(<App />, document.getElementById('app'));
