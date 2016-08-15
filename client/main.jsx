import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import cx from 'classname';

import Tree from 'react-ui-tree';
import Form from 'react-jsonschema-form';
//import App from '../imports/index.js';
import 'react-ui-tree/dist/react-ui-tree.css';

import {RightClickMenu} from './right_click_menu';
import { ContextMenuLayer } from "react-contextmenu";



const tree = { "configs": { "title": "A registration form", "description": "A simple form example.", "type": "object", "required": [ "firstName", "lastName", "password" ] }, "children": [ { "configs": { "type": "string", "title": "First name" }, "leaf": true, "name": "firstName" }, { "configs": { "type": "string", "title": "Last name" }, "leaf": true, "name": "lastName" }, { "configs": { "type": "integer", "title": "Age" }, "leaf": true, "name": "age" }, { "configs": { "type": "string", "title": "Bio" }, "leaf": true, "name": "bio" }, { "configs": { "type": "string", "title": "Password", "minLength": 3 }, "leaf": true, "name": "password" } ], "name": "root" }


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
    console.log(chr);
    node.children = chr;
  }
  else {
    node.configs = schema;
    node.leaf = true;
  }
  return node;
}
function compileSchema(tree){
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
  return compile(tree);
}

function getOrder(schema){
  if(schema.properties){
    let ui_order={'ur:order':Object.keys(schema.properties)};
    for(var i in schema.properties){
      const order = getOrder(i);
      if(order){
        ui_order[i]=order;
      }
    }
    return ui_order;
  }
}

const TreeWithRightClick = ContextMenuLayer(
    'tree',
    (props)=>props,
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
                {node.name + (node.configs && node.configs.type?'- ['+node.configs.type+']':'')}
            </span>
        );*/
      return (
          <span
              onClick={this.onClickNode.bind(null, node)}
              onContextMenu={this.onClickNode.bind(null, node)}
              className={cx('node', {
                      'is-active': node === this.state.active
                  })}
          >
              {node.name + (node.configs && node.configs.type?'- ['+node.configs.type+']':'')}
          </span>

      );
  },

  onClickNode(node) {
    this.setState({
      active: node
    });
  },

    onContextMenu(event){
        console.log('rightclick')
    },

  render() {
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
                <div className="inspector">
                    <Form
                        schema={compileSchema(this.state.tree)}
                        uiSchema={getOrder(compileSchema(this.state.tree))}
                    />
                    <hr />

                    <button onClick={this.updateTree}>parse</button>
                    <hr />
                    <textarea
                        ref='schemaRef'
                        value={JSON.stringify(compileSchema(this.state.tree), null, '  ')}
                        onChange={this.updateTree}>
                    </textarea>
                    <hr />
                    <pre>
                        {JSON.stringify(this.state.tree, null, '  ')}
                        <RightClickMenu />
                    </pre>
                    <div className="react-context-menu-wrapper ">
                        asdfasdfasdf

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
  updateTree() {
        //var tree = this.state.tree;
    const {schemaRef} = this.refs;
    let tree = decompile(JSON.parse(schemaRef.value));
    tree.name='root';
    console.log(tree);
    this.setState({
      tree: tree
    });
  }
});

Meteor.startup(() => {
  render(<App/>, document.getElementById('app'));
});
