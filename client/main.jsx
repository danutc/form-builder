import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import cx from 'classname';

import Tree from 'react-ui-tree';
import Form from 'react-jsonschema-form';
//import App from '../imports/index.js';
import 'react-ui-tree/dist/react-ui-tree.css';

import { RightClickMenu } from './right_click_menu';
import { ContextMenuLayer } from "react-contextmenu";
import deepMerge from 'deepmerge';
import preset from './preset'
import ToolTip from 'react-portal-tooltip';

import Editor from './editor';

import {decompile, compile, injectUiSchema, extractUiSchema, getUiOrder, deleteNode} from './utils.js';

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
        return {
            active: null,
            tree: tree
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
        if(active.children){
            if(active.configs.type == 'object'){
                console.log(item_type);
                let new_name = "new_"+item_type;
                let isNameExist = function (name){return active.children.find(function(chr){return chr.name == name})};
                if(isNameExist(new_name)){
                    let counter = 1;
                    while(isNameExist(new_name+'_'+counter)){
                        counter++;
                    }
                    new_name += '_'+counter;
                }
                new_item.name = new_name;
                console.log(new_item);
                active.children.push(new_item);
                this.setState({
                    active:new_item
                });
            }
        }else{
            console.log('leaf');
        }
        //this.setState({active});
    },
    onNodeUpdate(e,data){
        let active = Object.assign(this.state.active, data);
        this.setState({
            active
        });
    },
    getActiveNode(){
        return this.state.active;
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
                        onDeleteItem={this.onDeleteItem}
                        onNewItem={this.onNewItem}
                    />
                </div>
                <ToolTip active={!!this.state.active} parent=".is-active" position="bottom" arrow="left" group="result" >
                    <Editor getActiveNode={this.getActiveNode} onChange={this.onNodeUpdate} />
                </ToolTip>
                <div className="inspector">
                    <Form
                        schema={ schema }
                        uiSchema={ uiSchema }
                    />
                    <hr />

                    <button onClick={this.updateTree}>parse</button>
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
                    <hr />
                    <textarea
                        ref="treeRef"
                        value={JSON.stringify(this.state.tree, null, '  ')}
                        onChange={this.updateSchema}>
                    </textarea>
                    <RightClickMenu />
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
        this.setState({tree:JSON.parse(treeRef.value)});
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

Meteor.startup(() => {
    render(<App/>, document.getElementById('app'));
});
