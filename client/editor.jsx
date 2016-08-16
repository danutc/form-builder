import React from 'react';


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
