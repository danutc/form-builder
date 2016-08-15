import React from 'react';

import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

const widgets = [
    ['object','Object'],
    ['array','Array'],
    ['input','Input'],
    ['checkbox','Checkbox'],
    ['radio','Radio'],
    ['textarea','Text Area'],
    ['date','Date'],
    ['datetime','Date/Time'],
    ['email','Email'],
    ['uri','Uri'],
    ['wysiwyg','Wysiwyg'],
];

const MyContextMenu = React.createClass({
    render() {
        return (
            <ContextMenu identifier="tree" currentItem={this.currentItem}>
                {widgets.map((widget)=>(
                     <MenuItem key={widget[0]} onClick={this.handleClick} data={{item:widget[0]}}>
                         {widget[1]}
                     </MenuItem>
                 ))}
            </ContextMenu>
        );
    },
    handleClick(e, data) {
        data.onNewItem(e, data.item);
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
}
