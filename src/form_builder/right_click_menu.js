import React from 'react';

import { ContextMenu, MenuItem, ContextMenuLayer } from 'react-contextmenu';
import {Treebeard} from 'react-treebeard';
import deepcopy from 'deepcopy';
import {decompile, injectUiSchema} from './utils.js';


/*
const menu = {
  name:'Menu',
  children:[{
    name:'Quick Fields',
    children:[{
      name:'Full Name',
      node:fullname
    },{
      name:'Address',
      node:address
    }]
  },{
    name:'Basic Fields',
    children:[{
      name:'Textbox',
      node:textbox
    },{
      name:'Textarea',
      node:textarea
    }]
  }]
};
 */

import defaultMenu from './default_menu.js';

class TreeMenu extends React.Component {
  constructor(props) {
    super(props);
    let data = props.data;
    data.toggled = true;
    this.state = {data:data};
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(menuNode, toggled) {
    if(menuNode==this.state.data){
      const expendAll = !this.state.data.children.reduce((a,i)=>( i.toggled || a),false);
      this.state.data.children.forEach((i)=>{
        i.active = i.toggled = expendAll;
      });
      this.setState({ cursor: menuNode });
      return;
    }

    menuNode.toggled = menuNode.active = menuNode.children && toggled;
    this.setState({ cursor: menuNode });
    //menuNode.active = toggled;
    if(menuNode.node)
      this.props.onClick(this, menuNode.node);
  }

  render() {
    let { data } = this.state;
    return (
            <Treebeard
                data={data}
                onToggle={this.onToggle}
                />
        );
  }
}

const MyContextMenu = React.createClass({
  getInitialState() {
    const { presetItems } = this.props;
    let menu = deepcopy(this.props.menu || defaultMenu);
    for( var categoryIndex in menu.children){
      for ( var itemIndex in menu.children[categoryIndex].children){
        let item = menu.children[categoryIndex].children[itemIndex];
        let node = decompile(item.schema);
        if(item.uiSchema){
          node = injectUiSchema(node, item);
        }
        node.name = item.schemaName;
        item.node = node;
        delete item.schema;
        delete item.uiSchema;
      }
    }
    const _menu = () => (<TreeMenu data={menu} onClick={this.handleClick}/>);
    return {menu:_menu};
  },
  render() {
    return (
            <ContextMenu identifier="tree">
                <this.state.menu />
            </ContextMenu>
        );
  },
  handleClick(e, data) {
    console.log('ddddddddddd');
    this.props.onNewItem(e, deepcopy(data));
  },
  onDelete(e){
    //this.props.onDeleteItem(e);
  }
});


/*
   Label
   Object
   Array
   Input
   Checkbox
   Radio
   Text Area
   Date
   Date/Time
   Email
   Uri
   Wysiwyg
   Payment Status Field
*/

module.exports = {
  RightClickMenu: MyContextMenu
};
