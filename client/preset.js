import deepcopy from 'deepcopy';
import {decompile, compile, injectUiSchema, extractUiSchema, getUiOrder} from './utils.js';

function build(JSONSchema, UISchema){
    let tree=decompile(JSONSchema);
    if(UISchema){
        tree = injectUiSchema(tree,UISchema);
    }
    return tree;
}

let preset = {};

preset.object = build({
    "type": "object",
    "title": "Object Name"
});

preset.array = build({
    "type": "array",
    "title": "Nested list",
    "items": {
        "type": "object",
        "title": "Inner list",
        "properties": {}
    }
});

preset.input = build({
    "type": "string",
    "title": "Input"
});

preset.checkbox = build({
    "type": "array",
    "title": "A multiple choices list",
    "items": {
        "type": "string",
        "enum": [
            "1",
            "2",
            "3"
        ],
        "enumNames": [
            "one",
            "two",
            "three"
        ]
    },
    "uniqueItems": true
},{
    "ui:widget": "checkboxes"
});

preset.radio = build({
    "type": "boolean",
    "title": "radio buttons"
},{
    "ui:widget": "radio"
});

preset.textarea = build({
    "type": "string",
    "title": "Textarea"
},{
    "ui:widget": "textarea"
});

preset.date = build({
    "type": "string",
    "title": "Date",
    "format": "date"
});

preset.datetime = build({
    "type": "string",
    "title": "Datetime",
    "format": "datetime"
});

/*
preset.paymentStatus = builc({
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
let loader = {};
/*
Object.defineProperty(loader,'input',{
    get: function(){
        return deepcopy(preset['input']);
    }
});

Object.defineProperty(loader,'checkbox',{
    get: function(){
        return deepcopy(preset['checkbox']);
    }
});
*/

for(var i in preset){
    const node = preset[i];
    const getter = function(){
        return deepcopy(node);
    };
    Object.defineProperty(loader,i,{
        get: getter
    });
}

console.log('lllllllllllllllllllllllll');
console.log(loader);

export default loader;
