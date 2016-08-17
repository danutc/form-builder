import React from 'react';
import { Meteor } from 'meteor/meteor';
import cx from 'classname';

import Tree from 'react-ui-tree';
import Form from 'react-jsonschema-form';
//import App from '../imports/index.js';

import { RightClickMenu } from './right_click_menu';
import { ContextMenuLayer } from "react-contextmenu";
import deepMerge from 'deepmerge';
//import preset from './preset'
import ToolTip from 'react-portal-tooltip';

import Editor from './editor';

import deepcopy from 'deepcopy';

import {decompile, compile, injectUiSchema, extractUiSchema, getUiOrder, deleteNode, getParent} from './utils.js';

const tree = injectUiSchema(
    decompile({ "title": "A registration form", "description": "A simple form example.", "type": "object", "required": [ "firstName", "lastName" ], "properties": { "firstName": { "type": "string", "title": "First name" }, "lastName": { "type": "string", "title": "Last name" }, "age": { "type": "integer", "title": "Age" }, "bio": { "type": "string", "title": "Bio" }, "password": { "type": "string", "title": "Password", "minLength": 3 } } }),
    { "age": { "ui:widget": "updown" }, "bio": { "ui:widget": "textarea" }, "password": { "ui:widget": "password", "ui:help": "Hint: Make it strong!" }, "date": { "ui:widget": "alt-datetime" } }
);


const TreeWithRightClick = ContextMenuLayer(
    'tree',
    (props)=>{
        return props;
    }
)(Tree);

const App = React.createClass({
    getInitialState() {
        console.log(this.props);
        function buildPresetLoader(preset){
            let presetLoader = {};
            for(var i in preset){
                let node = decompile(preset[i].JSONSchema);
                if(preset[i].UISchema){
                    node = injectUiSchema(node,preset[i].UISchema);
                }
                const getter = function(){
                    return deepcopy(node);
                };
                Object.defineProperty(presetLoader,i,{
                    get: getter
                });
            }
            return presetLoader;
        }
        const preset = this.props.preset;
        console.log(preset);
        return {
            active: null,
            tree: tree,
            preset: buildPresetLoader(this.props.preset),
            clicktime: (new Date()).getTime(),
            formData: {}
        };
    },

    renderNode(node) {
        /*return (
           <span className={cx('node', {
           'is-active': node === this.state.active
           })} onClick={this.onClickNode.bind(null, node)}>
           {node.name + (node.configs && node.configs.type?' - ['+node.configs.type+']':'')}
           </span>
           );*/
        return (
            <span
                onClick={this.onClickNode.bind(null, node)}
                onContextMenu={this.onRightClickNode.bind(null, node)}
                className={cx('node', {
                        'is-active': node === this.state.active
                    })}
            >
                {node.name + (node.configs && node.configs.type?' - ['+node.configs.type+']':'')}
            </span>

        );
    },

    onRightClickNode(node){
        this.setState({
            active: node
        });
    },

    onClickNode(node) {
        this.setState({
            active: this.state.active == node ? undefined : node
        });
    },

    onContextMenu(event){

    },
    onDeleteItem(e){
        let active = this.state['active'];
        console.log(this.state.tree,active);
        if(active){
            this.setState({
                active:undefined,
                tree:deleteNode(this.state.tree,active)
            });
        }
    },
    onNewItem(e, item_type){
        let active = this.state['active'];
        const preset = this.state.preset;
        function addChildren(parent,item_type,after_child){
            function genNewName(parent,item_type){
                let new_name = item_type;
                function isNameExist(name){return !!parent.children && parent.children.find(function(chr){return chr.name == name})};
                if(isNameExist(new_name)){
                    let counter = 1;
                    while(isNameExist(new_name+'_'+counter)){
                        counter++;
                    }
                    new_name += '_'+counter;
                }
                return new_name;
            }
            new_item = preset[item_type];
            new_item.name = genNewName(parent, item_type);
            if(after_child){
                parent.children.splice(
                    parent.children.indexOf(after_child)+1,
                    0,
                    new_item
                );
            }else{
                parent.children.push(new_item);
            }
            return new_item;
        }
        if(active.children){
            if(active.configs.type == 'object'){
                this.setState({
                   active: addChildren(active,item_type)
                });
            }
        }else{
            let parent = getParent(this.state.tree, active);
            this.setState({
                active: addChildren(parent,item_type,active)
            });
        }
        //this.setState({active});
    },
    onNodeUpdate(e,data){
        console.log(data);
        let active = Object.assign(this.state.active, data);
        console.log("data ====================");
        console.log(data);
        this.setState({
            active
        });
    },
    getActiveNode(){
        return this.state.active;
    },
    onDataChange(e){
        if(this.state.tree==this.state.active || !this.state.active ){
            this.setState({formData:e.formData});
        }
    },
    render() {
        const schema = compile(this.state.active||this.state.tree);
        const uiSchema = deepMerge(
            getUiOrder(schema),
            extractUiSchema(this.state.active||this.state.tree),
        );
        return (
            <div className="app">
                <div className="tree" onContextMenu={this.onContextMenu}>
                    <TreeWithRightClick
                        paddingLeft={20}
                        tree={this.state.tree}
                        onChange={this.handleChange}
                        isNodeCollapsed={this.isNodeCollapsed}
                        renderNode={this.renderNode}
                    />
                </div>
                {(this.state.editing && false)?
                (<ToolTip active={!!this.state.editing} parent=".is-active" position="bottom" arrow="center" group="result" >
                    <Editor getActiveNode={this.getActiveNode} onChange={this.onNodeUpdate} />
                </ToolTip>):(null)}
                <div className="inspector">
                    <div className="col-md-9">
                        <Form
                            schema={ schema }
                            uiSchema={ uiSchema }
                            fields={ this.props.fields }
                            onChange={ this.onDataChange }
                            formData={ this.state.tree==this.state.active || !this.state.active ? this.state.formData:undefined}
                        />
                        <hr />
                        <textarea
                            ref="schemaRef"
                            value={JSON.stringify(compile(this.state.tree), null, '  ')}
                            onChange={this.updateTree}>
                        </textarea>
                        <textarea
                            ref="uiSchemaRef"
                            value={JSON.stringify(extractUiSchema(this.state.tree), null, '  ')}
                            onChange={this.updateTree}>
                        </textarea>

                        <textarea
                            ref="dataRef"
                            value={JSON.stringify(this.state.formData, null, '  ')}>
                        </textarea>

                        <hr />
                        <textarea
                            ref="treeRef"
                            value={JSON.stringify(this.state.tree, null, '  ')}
                            onChange={this.updateSchema}>
                        </textarea>
                        <RightClickMenu
                            onDeleteItem={this.onDeleteItem}
                            onNewItem={this.onNewItem}
                            presetItems={Object.keys(this.props.preset)}
                        />
                    </div>
                    <div className="col-md-3">
                        <Editor getActiveNode={this.getActiveNode} onChange={this.onNodeUpdate} getActiveNode={()=>this.state.active}/>
                        <hr />
                    </div>
                </div>
            </div>
        );
    },

    handleChange(tree) {
        this.setState({
            tree: tree
        });
        this.forceUpdate();
    },
    updateSchema(){
        const {treeRef} = this.refs;
        this.setState({tree:JSON.parse(treeRef.valu)});
    },
    updateTree() {
        //var tree = this.state.tree;
        const {schemaRef,uiSchemaRef} = this.refs;
        let tree = decompile(JSON.parse(schemaRef.value));
        tree = injectUiSchema(
            tree,
            JSON.parse(uiSchemaRef.value)
        );

        tree.name='root';
        this.setState({
            tree: tree
        });
    }
});

export default App;
