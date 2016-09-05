import React from 'react';
import cx from 'classname';

import Tree from 'react-ui-tree';
import _Form from 'react-jsonschema-form';
//import App from '../imports/index.js';

import { RightClickMenu } from './right_click_menu';
import { ContextMenuLayer } from 'react-contextmenu';
import deepMerge from 'deepmerge';
//import preset from './preset'
import ToolTip from 'react-portal-tooltip';

import Editor from './editor';

import JsonEditor from './json_editor.js';

import deepcopy from 'deepcopy';

import {decompile, compile, injectUiSchema, extractUiSchema, getUiOrder, deleteNode, getParent} from './utils.js';

import extensions from '../form_engine_extensions';
// Add support for inline validation
const Form = extensions.conditional_logic(extensions.inline_validation(_Form));
//const Form = _Form;

const TreeWithRightClick = ContextMenuLayer(
  'tree',
  (props) => {
    return props;
  }
)(Tree);

const App = React.createClass({
  getInitialState() {
    function buildPresetLoader(preset) {
      let presetLoader = {};
      for (var i in preset) {
        let node = decompile(preset[i].JSONSchema);
        if (preset[i].UISchema) {
          node = injectUiSchema(node, preset[i].UISchema);
        }
        const getter = function () {
          return deepcopy(node);
        };
        Object.defineProperty(presetLoader, i, {
          get: getter
        });
      }
      return presetLoader;
    }

    const preset = this.props.preset;
    const {formName, formSchema: {schema, uiSchema}} = this.props;
    let tree = injectUiSchema(decompile(schema), uiSchema);

    tree.name = formName;

    return {
      active: null,
      tree: tree,
      schema,
      uiSchema,
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
        onClick={this.onClickNode.bind(null, node) }
        onContextMenu={this.onRightClickNode.bind(null, node) }
        className={cx('node', {
          'is-active': node === this.state.active
        }) }
        >
        {node.name + (node.configs && node.configs.type ? ' - [' + node.configs.type + ']' : '') }
        {(node != this.state.tree) ?
          (<a
            href="#"
            style={{ flow: 'right' }}
            onClick={(e) => { this.onDeleteItem(e, node); e.stopPropagation(); } }>
        ✘
         </a>)
         :
         null
        }
      </span>

    );
  },

  onRightClickNode(node) {
    this.setState({
      active: node
    });
  },

  onClickNode(node) {
    this.setState({
      active: this.state.active == node ? undefined : node
    });
  },

  onContextMenu(event) {

  },
  onDeleteItem(e, item) {
    let active = item||this.state['active'];
    if(!confirm('Node "'+active.name+'" will be deleted!')){
      return;
    }
    if (active) {
      this.setState({
        active: undefined,
        tree: deleteNode(this.state.tree, active)
      });
    }
  },
  onNewItem(e, item) {
    let active = this.state['active'];
    const preset = this.state.preset;
    function addChildren(parent, item, after_child) {
      function genNewName(parent, item_name) {
        let new_name = item_name;
        function isNameExist(name) { return !!parent.children && parent.children.find(function (chr) { return chr.name == name; }); }
        if (isNameExist(new_name)) {
          let counter = 1;
          while (isNameExist(new_name + '_' + counter)) {
            counter++;
          }
          new_name += '_' + counter;
        }
        return new_name;
      }
      let new_item = item;//preset[item_type];
      new_item.name = genNewName(parent, item.name || "item");
      if (after_child) {
        parent.children.splice(
          parent.children.indexOf(after_child) + 1,
          0,
          new_item
        );
      } else {
        parent.children.push(new_item);
      }
      return new_item;
    }
    if (active.configs.type == 'object') {
      if (active.children) {
        this.setState({
          active: addChildren(active, item)
        });
      }
    } else {
      let parent = getParent(this.state.tree, active);
      this.setState({
        active: addChildren(parent, item, active)
      });
    }
    //this.setState({active});
  },
  onNodeUpdate(e, data) {
    let active = this.state.active;
    for(var i in data){
      if(typeof(data[i])=='object' && Array.isArray(data[i])){
        active[i] = Object.assign(active[i],data[i]);
      }else{
        active[i] = data[i];
      }
    }
    this.setState({
      active
    });
    this.updateTree(this.state.tree);
  },
  getActiveNode() {
    return this.state.active;
  },
  onDataChange(e) {
    if (this.state.tree == this.state.active || !this.state.active) {
      this.setState({ formData: e.formData });
    }
  },
  _clearForm() {
    this.setState({
      active: undefined,
      tree: {name:'new_form',configs: {'type':'object'},children:[]},
      formData: {}
    });
  },
  render() {
    const schema = this.state.active && compile(this.state.active) || this.state.schema;
    const uiSchema = deepMerge(
      getUiOrder(schema),
      this.state.active && extractUiSchema(this.state.active) || this.state.uiSchema
    );

    return (
      <div className="app">
        <div className="col-xs-2" onContextMenu={this.onContextMenu}>
        <div className="tree col-xs-2">
        <h3>Form Fields</h3>
          <TreeWithRightClick
              paddingLeft={20}
              tree={this.state.tree}
              onChange={this.handleChange}
              isNodeCollapsed={this.isNodeCollapsed}
              renderNode={this.renderNode}
          />
        <br/>
        <button className="btn btn-success col-md-6" onClick = { (e)=>(this.props.onSubmit({
          name:this.state.tree.name,
          schema:this.state.schema,
          uiSchema:this.state.uiSchema
        })) }
        >Save</button>
        <button className="btn btn-danger clear-form col-md-6" onClick={this._clearForm}>Clear Form </button>
        </div>
        </div>
        {
          (this.state.editing && false) ?
          (
            <ToolTip active={!!this.state.editing} parent=".is-active" position="bottom" arrow="center" group="result" >
              <Editor getActiveNode={this.getActiveNode} onChange={this.onNodeUpdate} />
            </ToolTip>
          )
          :
          (null)
        }
            <div className="inspector col-xs-7">
              <h3>Form Preview</h3>

              <Form
                  schema={ schema }
                  uiSchema={ uiSchema }
                  widgets={ this.props.widgets }
                  fields={ this.props.fields }
                  onChange={ this.onDataChange }
                  formData={ this.state.tree == this.state.active || !this.state.active ? this.state.formData : undefined}
                  liveValidate={true}
              >
                {(this.state.active||true?<button hidden></button>:null)}
              </Form>
              <div className="col-md-12">
              <hr />
              <div className="col-md-6">
                <JsonEditor
                    title={"schema"}
                    code={JSON.stringify(this.state.schema, null, '  ') }
                    onChange={this.updateSchema} />
              </div>
              <div className="col-md-6">
                <JsonEditor
                  title={"uiSchema"}
                  code={JSON.stringify(this.state.uiSchema, null, '  ') }
                  onChange={this.updateUiSchema} />
             </div>
             <div className="col-md-6">
               <JsonEditor
                 title={"formData"}
                 code={JSON.stringify(this.state.formData, null, '  ') } />
             </div>

             <div className="col-md-6">
              <JsonEditor
                   title={"tree"}
                   code={JSON.stringify(this.state.tree, null, '  ') }
                   onChange={this.updateTree} />
             </div></div>

              <RightClickMenu
                  onDeleteItem={this.onDeleteItem}
                  onNewItem={this.onNewItem}
                  menu={ this.props.menu }
              />
            </div>

            {
              this.state.active ? (
                  <div className="form-editor col-xs-3">
                  <div className="editor col-xs-3">
                  <h3>Widget & Field Configuration</h3>
                  <Editor getActiveNode={this.getActiveNode} onChange={this.onNodeUpdate} getActiveNode={() => this.state.active}/>
                  <hr />
                  </div>
                </div>
              ) : (null)
            }
      </div>
    );
  },

  handleChange(tree) {
    const uiSchema = extractUiSchema(tree);
    const schema = compile(tree);
    this.setState({
      tree: tree,
      schema,
      uiSchema
    });
    this.forceUpdate();
  },
  updateSchema(schema) {
    const tree = injectUiSchema(decompile(schema),this.state.uiSchame);
    tree.name = this.name || this.state.tree.name;
    this.setState({ tree,schema});
    this.forceUpdate();
  },
  updateUiSchema(uiSchema){
    const tree = injectUiSchema(this.state.tree, uiSchema);
    this.setState({tree,uiSchema});
    this.forceUpdate();
  },
  updateTree(tree) {
    //var tree = this.state.tree;
    const uiSchema = extractUiSchema(tree);
    const schema = compile(tree);
    tree.name = this.state.tree.name || 'root';
    this.setState({
      tree,
      schema,
      uiSchema
    });
    this.forceUpdate();
  }
});

export default App;
