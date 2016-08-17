import React from 'react';

var commonEditFormSchema = {
    type: 'object',
    title: 'General',

    properties: {
        label: { type: 'string', title: 'Label' },
        class: { type: 'string', title: 'Class' },
        name: { type: 'string', title: 'Name' },
        defaultValue: { type: 'string', title: 'Default Value' },
        placeHolder: { type: 'string', title: 'Place Holder' },
        hint: { type: 'string', title: 'Hint' },
        depth: { type: 'number', title: 'Depth of the element' }
    }
}


const JSONSchemaEditor = React.createClass({
    render(){
        return (<div></div>);
    }
});

const UISchemaEditor = React.createClass({
    render(){
        return (<div></div>);
    }
});

const Editor = React.createClass({
    onChange(e){
        const new_data = {
            name: this.refs.nameRef.value,
            configs: JSON.parse(this.refs.configsRef.value),
            ui: JSON.parse(this.refs.uiRef.value),
        };
        console.log(new_data);
        this.props.onChange(e, new_data);
    },
    render() {
        //const {onChange} = this.props;
        const node = this.props.getActiveNode();
        if(!node)  return null;
        return (<div>
            <input ref="nameRef" type="text" value={node.name} onChange={this.onChange} />
            <textarea
                ref="configsRef"
                value={JSON.stringify(node.configs||{}, null, '  ')}
                onChange={this.onChange}>
            </textarea>
            <textarea
                ref="uiRef"
                value={JSON.stringify(node.ui||{}, null, '  ')||{}}
                onChange={this.onChange}>
            </textarea>
        </div>);
    }

});

export default Editor;
