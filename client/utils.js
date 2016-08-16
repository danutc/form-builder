function deepEqual(a,b){
    function e(a,b,stack){
        stack=stack||[];
        if(typeof(a)=='object'){
            for(var i in a){
                stack.push(i);
                if(!e(a[i],b[i],stack)){
                    return false;
                }
                stack.pop(i);
            }
            return true;
        }
        if( a === b){
            return true;
        }else{
            console.log(stack,a,b);
            return false;
        }
    }
    return e(a,b) && e(b,a);
}

function decompile(schema){
    let node = {configs:{}};
    if(schema.type == 'object'){
        for(var i in schema){
            if('properties'!==i){
                node.configs[i] = schema[i];
            }
        }
        node.children = [];
        for(var i in schema.properties){
            let chr =decompile(schema.properties[i]);
            chr.name = i;
            node.children.push(chr);
        }
    }
    else if(schema.type == 'array'){
        for(var i in schema){
            if(['items','additionalItems'].indexOf(i)<0){
                node.configs[i] = schema[i];
            }
        }
        let chr = [];
        if(Array.isArray(schema.items)){
            chr.push({
                name:'items_array',
                children:  schema.items.map((i,index)=>{
                    let c = decompile(i);
                    c.name=index;
                    return c;
                }),
            });
        }else{
            let c = decompile(schema.items);
            c.name = 'items',
                chr.push(c);
        }
        if(schema.additionalItems){
            let c = decompile(schema.additionalItems);
            c.name = 'additionalItems';
            chr.push(c);
        }
        node.children = chr;
    }
    else {
        node.configs = schema;
        node.leaf = true;
    }
    return node;
}

function decompileSchema(tree){
    let root = decompile(tree);
    root.name = 'root';
    return root;
}

function compile(node){
    let schema = Object.assign({},node.configs);
    if(node.children){
        if(node.configs.type === 'object'){
            schema = Object.assign({},node.configs);
            schema.properties = {};
            node.children.forEach((i)=>{
                schema.properties[i.name] = compile(i);
            });
        }
        else if(node.configs.type === 'array'){
            node.children.forEach((i)=>{
                if(i.name==='items'){
                    schema.items = compile(i);
                }
                else if(i.name==='items_array'){
                    schema.items = i.children.map((j)=>{
                        return compile(j);
                    });
                }
                else if(i.name==='additionalItems'){
                    schema.additionalItems = compile(i);
                }
            });
        }
    }
    return schema;
}

function compileSchema(tree){
    return compile(tree);
}

function injectUiSchema(n,uiSchema){
    let node = Object.assign({},n);
    uiSchema = uiSchema || {};
    for(var i in uiSchema){
        if(i.startsWith('ui:')){
            node.ui = node.ui||{};
            node.ui[i]=uiSchema[i];
        }
    }
    if(node.configs.type == 'object'){
        node.children = node.children.map((i)=>{
            if(uiSchema[i.name]){
                return injectUiSchema(i,uiSchema[i.name]);
            }
            return i;
        });
    }

    else if(node.configs.type == 'array'){
        node.children = node.children.map((i)=>{
            if(i.name=='items_array'){

                let res = Object.assign({},i,{
                    children: i.children.map((child,index)=>(
                         (index in uiSchema.items)?
                               injectUiSchema(child,uiSchema.items[index])
                              :child))

                });
                console.log(res);
                return res;
            }else if(i.name=='items'){
                return injectUiSchema(i,uiSchema.items);
                //let items_ui = extractUiSchema(i);
                //items_ui && (ui_schema['items'] = items_ui);
            }else if(i.name=='additionalItems'){
                return injectUiSchema(i,uiSchema.additionalItems);
            }
        });
    }
    return node;
}

function extractUiSchema(node){
    let ui_schema = node.ui || {};
    if(node.configs.type == 'object'){
        for (var i in node.children){
            i = node.children[i];
            let children_ui = extractUiSchema(i);
            if (children_ui && Object.keys(children_ui).length>0){
                ui_schema[i.name] = children_ui;
            }
        }
    }
    else if(node.configs.type == 'array'){
        for (var i in node.children){
            i = node.children[i];
            if(i.name=='items_array'){
                let items_array_ui = i.children.map(extractUiSchema);
                ui_schema.items = items_array_ui;
            }else if(i.name=='items'){
                let items_ui = extractUiSchema(i);
                items_ui && (ui_schema.items = items_ui);
            }else if(i.name=='additionalItems'){
                let additional_items_ui = extractUiSchema(i);
                additional_items_ui && Object.keys(additional_items_ui) > 0 && (ui_schema.additionalItems = additional_items_ui);
            }
        }
    }
    return ui_schema;
}

function getOrder(schema){
    if(schema.properties){
        let ui_order={'ui:order':Object.keys(schema.properties)};
        for(var i in schema.properties){
            const order = getOrder(i);
            if(order){
                ui_order[i]=order;
            }
        }
        return ui_order;
    }
    else if (schema.type == 'array'){
        let ui_order = {};
        if(Array.isArray(schema.items)){
            ui_order.items = schema.items.map(getOrder);
        }else{
            ui_order.items = getOrder(schema.items);
        }
        if(schema.additionalItems){
            ui_order.additionalItems = getOrder(schema.additionalItems);
        }
        return ui_order;
    }
}

module.exports = {
    compile: compileSchema,
    decompile: decompileSchema,
    injectUiSchema: injectUiSchema,
    extractUiSchema: extractUiSchema,
    getUiOrder: getOrder
};