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
                <MenuItem onClick={this.handleClick} data={{item:"some_data"}}>
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem onClick={this.handleClick} data={{item:"some_data"}}>
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem onClick={this.handleClick} data={{item:"some_data"}}>
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu>
        );
    },
    handleClick(e, data) {
        console.log(data);
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
