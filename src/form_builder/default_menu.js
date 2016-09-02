import deepcopy from 'deepcopy';
import {decompile, injectUiSchema} from './utils.js';

let basic = {};

let custom = {};

let quick = {};

basic.object = {
    "schema": {
        "type": "object",
        "title": "Object"
    }
};

basic.array = {
    "schema": {
        "type": "array",
        "title": "List",
        "items": {
            "type": "object",
            "title": "List item",
            "properties": {}
        }
    }
};

custom.label = {
    "schema": {
        "type": "string",
        "title": "Label"
    },
    "uiSchema": {
        "ui:field": "label"
    }
};

basic.textbox = {
    "schema": {
        "type": "string",
        "title": "Textbox"
    }
};

basic.textarea = {
  "schema": {
    "type": "string",
    "title": "Textarea"
  },
  "uiSchema": {
    "ui:widget": "textarea"
  }
};

basic.dropdown = {
  "schema":{
    "type": "string",
    "title": "Drop Drown",
    "enum": ["option1","option2","option3"],
    "enumNames": ["Option 1","Option 2","Option 3"]
  }
}

basic.radio = {
  "schema": {
    "type": "string",
    "title": "Radio",
    "enum": ["r1", "r2", "r3"],
    "enumNames": ["Option 1", "Option 2", "Option 3"]
  },
  "uiSchema": {
    "ui:widget": "radio"
  }
};

/*
basic.email = {
    "schema": {
        "type": "string",
        "title": "Email",
        "format": "email"
    }
};
*/

basic.checkbox = {
    "schema": {
        "type": "array",
        "title": "Check Box",
        "items": {
            "type": "string",
            "enum": [
                "1",
                "2",
                "3"
            ],
            "enumNames": [
                "Option 1",
                "Option 2",
                "Option 3"
            ]
        },
        "uniqueItems": true
    },
    "uiSchema": {
        "ui:widget": "checkboxes"
    }
};

//================================================================================//

quick.fullname = {
  "schema":{
    "type":"object",
    "title":"Full Name",
    "properties":{
      "firstname":{
        "title":"First Name",
        "type":"string"
      },
      "lastname":{
        "title":"Last Name",
        "type":"string"
      }
    }
  },
  "uiSchema":{
    "firstname":{"classNames":"col-md-6"},
    "lastname":{"classNames":"col-md-6"}
  }
}

quick.email = {
  "schema": {
    "type": "string",
    "title": "Email",
    "format": "email"
  }
};

quick.address = {
  "schema":{
    "type":"object",
    "title":"Address",
    "properties":{
      "streetAddress":{
        "type":"string",
        "title":"Street Address",
      },
      "city":{
        "type":"string",
        "title":"City",
      },
      "state":{
        "type":"string",
        "title":"State/Province"
      },
      "postcode":{
        "type":"number",
        "title":"Postal/Zip Code"
      },
      "country":{
        "type" :"string",
        "title":"Country"
      }
    }
  },
  "uiSchema":{
    "city":{"classNames":"col-md-6"},
    "state":{"classNames":"col-md-6"},
    "postcode":{"classNames":"col-md-6"},
    "country":{"classNames":"col-md-6"},
  }
}

quick.date = {
    "schema": {
        "type": "string",
        "title": "Date",
        "format": "date"
    }
};

quick.datetime = {
    "schema": {
        "type": "string",
        "title": "DateTime",
        "format": "datetime"
    },
    "uiSchema": {
        "ui:field": "dateTime"
    }
};


/*
basic.wysiwyg = {
    "schema": {
        "type": "string"
    },
    "uiSchema": {
        "ui:field": "wysiwyg"
    }
};
 */
/*
basic.paymentStatus = {
    "schema": {
        "type": "object"
    },
    "uiSchema": {
        "ui:field": "paymentStatus"
    }
};
*/
/*
basic.paymentStatus = builc({
    type: 'string',
    title: 'Payment Status',
    default: {
        total: 0,
        balance: 0,
        paymentStatus: '',
        purchase: false
    }
},{
    'ui:widget': 'paymentStatus'
});
*/
/*
Object.defineProperty(loader,'input',{
    get: function(){
        return deepcopy(basic['input']);
    }
});

Object.defineProperty(loader,'checkbox',{
    get: function(){
        return deepcopy(basic['checkbox']);
    }
});
*/

function convert2menu(schemas){
  return Object.keys(schemas).map((name)=>{
    //let node = decompile(schemas[name].schema);
    //if(schemas[name].uiSchema){
    //  node = injectUiSchema(node,schemas[name].uiSchema);
    //}
    //node.name = name;
    return {name: schemas[name].schema.title, schemaName:name , schema:schemas[name].schema, uiSchema:schemas[name].uiSchema};
  });
}

export default {
  name:'Menu',
  children:[{
    name:'Quick Fields',
    children:convert2menu(quick)
  },{
    name:'Basic Fields',
    children:convert2menu(basic)
  }]
};
