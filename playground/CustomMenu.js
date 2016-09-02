import menu from '../src/form_builder/default_menu.js';


let custom = {};

custom.label = {
  "schema": {
    "type": "string",
    "title": "Label"
  },
  "uiSchema": {
    "ui:widget": "label"
  }
};

custom.paymentStatus = {
  "schema": {
    "title":"Payment Status",
    "type": "object"
  },
  "uiSchema": {
    "ui:field": "paymentStatus"
  }
};

custom.wysiwyg = {
  "schema": {
    "type": "string",
    "title": "Wysiwyg"
  },
  "uiSchema": {
    "ui:widget": "wysiwyg"
  }
};


menu.children.push({
  name:"Custom Fields",
  children:Object.keys(custom).map((name)=>({
    name:custom[name].schema.title,
    schemaName: name,
    schema: custom[name].schema,
    uiSchema: custom[name].uiSchema
  }))
});

export default menu;
