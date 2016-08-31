import React from 'react';

import { ContextMenu, MenuItem, ContextMenuLayer } from 'react-contextmenu';
import {Treebeard} from 'react-treebeard';

const widgetTypes = {
  'array': [],
  'custom widgets': [],
  'object': [],
  'string': [{ name: 'string' }, { name: 'textarea' }],
  'boolean': [{ name: 'radio' }, { name: 'checkbox' }],
  'number': [],
  'integer': []
};

class TreeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    if (this.state.cursor) { this.state.cursor.active = false; }
    node.active = true;
    if (node.children) { node.toggled = toggled; }
    this.setState({ cursor: node });
    let { onClick } = this.props;

    onClick(this, node);
  }

  render() {
    let { data } = this.props;

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
    return {};
  },
  render() {
    const { presetItems } = this.props;

    const widgets = [];
    for (let k in widgetTypes) {
      widgets.push([k, widgetTypes[k]]);
    }

    let tree = {
      name: 'Fields',
      toggled: false,
      children: []
    };

    widgets.map((w, idx) => {
      tree.children.push({name: w[0], children: w[1] || []});
    });
    return (
            <ContextMenu identifier="tree" currentItem={this.currentItem}>
                <TreeMenu data={tree} onClick={this.handleClick}/>
                <TreeMenu data={{
                  name: 'delete'
                }} onClick={this.handleClick}/>
            </ContextMenu>
        );
  },
  handleClick(e, data) {
    if (data.name == 'delete') {
      this.props.onDeleteItem(e);
    } else {
      this.props.onNewItem(e, data.name);
    }
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
