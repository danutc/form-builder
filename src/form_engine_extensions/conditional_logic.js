import React from 'react';
import deepmerge from 'deepmerge';
import deepcopy from 'deepcopy';

function _compile_contition(schema){
  if(schema.type=='object'){
    const condition_fun = schema.conditional && schema.conditional.map(function(condition){
      return [new Function('return ('+condition.clause+')'), condition.properties];
    });
    let children_f = {};
    for( var child in schema.properties){
      const f = _compile_contition(schema.properties[child]);
      if (f){
        children_f[child] = f;
      }
    }

    return function (formData){
      let ui_hidden_properties={};
      if (condition_fun){
        for(var i in condition_fun){
          if(!condition_fun[i][0].call(formData)){
            const properties_list = condition_fun[i][1];
            for(var j in properties_list){
              ui_hidden_properties[properties_list[j]]={'ui:widget':'hidden','ui:disabled':true};
            }
          }
        }
      }

      for(var i2 in children_f){
        if(!(i2 in ui_hidden_properties)){
          ui_hidden_properties[i2] = children_f[i2](formData[i2]);
        }
      }
      return ui_hidden_properties;
    };
  }
  if(schema.type=='array'){
    if(Array.isArray(schema.items)){
      const items_f = schema.items.map(_compile_contition);
      return function(formData){
        let ui_hidden_properties=[];
        for(var i in items_f){
          ui_hidden_properties[i]=items_f[i](formData[i]);
        }
        return ui_hidden_properties;
      };
    }
  }
};


function compile_contition(schema){
  const f = _compile_contition(schema);
  return f?f:function(a){return {};};
}


function _compile_datafilter(schema){
  if(schema.type=='object'){
    const condition_fun = schema.conditional && schema.conditional.map(function(condition){
      return [new Function('return ('+condition.clause+')'), condition.properties];
    });
    let children_f = {};
    for( var child in schema.properties){
      const f = _compile_datafilter(schema.properties[child]);
      if (f){
        children_f[child] = f;
      }
    }

    return function (formData){
      let newFormData={};
      let newFormProperties = Object.keys(formData);
      if (condition_fun){
        const hidded = condition_fun.filter(function (f){
          return !f[0].call(formData);
        });
        newFormProperties = newFormProperties.filter(function(property){
          return !hidded.find(function(hidded_properties){
            return hidded_properties[1].indexOf(property)>=0;
          });
        });
      }
      console.log(newFormProperties);
      for(var i2 in children_f){
        if(newFormProperties.indexOf(i2)>=0){
          newFormData[i2] = children_f[i2](formData[i2]);
        }
      }
      return newFormData;
    };
  }
  if(schema.type=='array'){
    if(Array.isArray(schema.items)){
      const items_f = schema.items.map(_compile_datafilter);
      return function(formData){
        let newFormData=[];
        for(var i in items_f){
          newFormData[i]=items_f[i](formData[i]);
        }
        return newFormData;
      };
    }
  }
  return function(schema){return schema;};
};

function compile_datafilter(schema){
  return _compile_datafilter(schema);
}

function conditional_logic_extension(FormComponent){
  class Extended extends React.Component{
    constructor(props) {
      super(props);
      const condition_fun = compile_contition(this.props.schema);
      const datafilter_fun = compile_datafilter(props.schema);
      this.state = {
        condition_fun:condition_fun,
        datafilter_fun:datafilter_fun,
        uiSchema:deepmerge(deepcopy(this.props.uiSchema), condition_fun(this.props.formData)),
        formData:this.props.formData,
        schema:props.schema
      };
    }
    onChange(e){
      const new_uiSchema = deepmerge(deepcopy(this.props.uiSchema), this.state.condition_fun(e.formData));
      const newFormData = this.state.datafilter_fun(e.formData);
      this.setState({uiSchema:new_uiSchema,formData:e.formData});
      this.props.onChange && this.props.onChange(Object.assign({},e, {formData:newFormData}));
    }
    componentWillReceiveProps(props){
      const condition_fun = compile_contition(props.schema);
      const datafilter_fun = compile_datafilter(props.schema);
      this.setState({
        condition_fun:condition_fun,
        datafilter_fun:datafilter_fun,
        uiSchema:deepmerge(deepcopy(props.uiSchema), condition_fun(props.formData)),
        schema:props.schema,
        formData: props.schema==this.state.schema?this.state.formData:props.formData
      });
    }
    render(){
      //console.log(this.state.uiSchema);
      const props = {
          ...this.props,
        onChange:this.onChange.bind(this),
        uiSchema:this.state.uiSchema,
        formData:this.state.formData
      };
      return (<FormComponent {
          ...props
      }>{this.props.children}</FormComponent>);
    }
  }
  return Extended;
}
export default conditional_logic_extension;
