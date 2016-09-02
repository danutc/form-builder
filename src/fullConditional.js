import React from 'react';
import ObjectField from 'react-jsonschema-form/lib/components/fields/ObjectField';
import deepcopy from 'deepcopy';

function eval_fun(str_fun){
  if(str_fun){
    return new Function('args','return ('+str_fun+')(args);');
  }
  return function(a){return a;};
}



class FullControlConditional extends React.Component{
  constructor(props){
    super(props);
    const condition_fun = eval_fun(
      props.schema.conditionFun
    );
    let new_props=deepcopy({
      schema:this.props.schema,
      uiSchema:this.props.uiSchema,
    });
    if(this.props.formData){
      new_props.formData = props.formData;
    }
    let {schema,uiSchema,formData} = condition_fun(new_props);
    if (uiSchema.hasOwnProperty('ui:order')){
      uiSchema = Object.assign({},uiSchema,{
        'ui:order':props.uiSchema['ui:order'].filter(
          (p)=>p in schema.properties
        )});
    }
    this.state = {
      schema,
      uiSchema,
      formData,
      condition_fun
    };
  }
  componentWillReceiveProps(nextProps){
    let condition_fun = this.state.condition_fun;
    if(nextProps.uiSchema != this.props.uiSchema){
      condition_fun = eval_fun(
        nextProps.schema.conditionFun
      );
      this.setState({condition_fun:condition_fun});
    }
    let new_props=deepcopy({
      schema:nextProps.schema,
      uiSchema:nextProps.uiSchema,
      formData:nextProps.formData || this.state.formData
    });
    let {schema,uiSchema,formData} = condition_fun(new_props);
    if (uiSchema.hasOwnProperty('ui:order')){
      uiSchema = Object.assign({},uiSchema,{
        'ui:order':nextProps.uiSchema['ui:order'].filter(
        (p)=>p in schema.properties
      )});
    }
    this.setState({schema,uiSchema,formData});
  }
  onChange(_formData, options){
    if(this.state.condition_fun){
      let new_props=deepcopy({
        schema:this.props.schema,
        uiSchema:this.props.uiSchema,
        formData:_formData
      });

      let {schema,uiSchema,formData} = this.state.condition_fun(new_props);
      //let {schema,uiSchema,formData} = myCondition(kcuf);
      if (uiSchema.hasOwnProperty('ui:order')){
        uiSchema = Object.assign({},uiSchema,{
          'ui:order':this.props.uiSchema['ui:order'].filter(
            (p)=>p in schema.properties
          )});
      }
      this.setState({
        schema,
        uiSchema,
        formData:formData
      });
      this.props.onChange(formData);
    }
    this.props.onChange(_formData);
  }
  render (){
    const props = {
      ...this.props,
      onChange:this.onChange.bind(this),
      schema:this.state.schema,
      uiSchema:this.state.uiSchema,
      formData:this.state.formData
    };
    return (<ObjectField {...props} />);
  }
}

export default FullControlConditional;
