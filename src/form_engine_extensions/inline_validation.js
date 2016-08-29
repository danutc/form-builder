import React from 'react';


function build_validator(schema){
  let validator = function(schema,errors){return errors;};
  if(!schema){
    return validator;
  }

  if(schema.validate){
    const _validators = schema.validate.map(function(a){
      return {
        clause: new Function('return ('+a.clause+');'),
        message: a.message
      };
    });
    validator = function(formData, errors){
      const err = _validators.find(function(v){
        return v.clause.call(formData);
      });
      if(err){
        errors.addError(err.message);
      }
      return errors;
    };
  }

  if(schema.type == 'object'){
    let children_validators = Object.keys(schema.properties).map(function(name){
      return [name, build_validator(schema.properties[name])];
    });
    return function(formData,errors){
      if(formData) {
        errors = children_validators.reduce(function(e, c){
          if(c[0] in e){
            //let r = c[1](formData[c[0]],e[c[0]]);
            e[c[0]] = c[1](formData[c[0]],e[c[0]]);
          }
          return e;
        }, errors);
      }
      errors = validator(formData, errors);
      //console.log(['*',errors]);
      return errors;
    };
  }

  if(schema.type == 'array'){
    if(Array.isArray(schema.items)){
      const itemsValidator = schema.items.map(function(i){
        return build_validator(i);
      });
      const additionalItemsValidator = build_validator(schema.additionalItems);
      return function(formData, errors){
        if(formData){
          for(var i in formData){
            if(i < itemsValidator.length){
              errors[i] = itemsValidator[i](formData[i],errors[i]);
            }else{
              errors[i] = additionalItemsValidator(formData[i],errors[i]);
            }
          }
        }
        errors = validator(formData, errors);
        return errors;
      };
    }
    else{
      const itemsValidator = build_validator(schema.items);
      return function(formData, errors){
        if(formData) {
          if(!Array.isArray(formData)){
            errors.addError('is not of a type(s) array');
            return errors;
          }
          formData.forEach(function(data, i){
            errors[i] = itemsValidator(data,errors[i]);
          });
        }
        errors = validator(formData, errors);
        return errors;
      };
    }
  }
  return validator;
}

function inline_validation_extension(FormComponent){
  class Extended extends React.Component{
    constructor(props) {
      super(props);
      const validate_fun = build_validator(props.schema);
      this.state = {
        validate_fun:validate_fun,
        schema:props.schema
      };
    }
    componentWillReceiveProps(props){
      this.setState({
        validate_fun: build_validator(props.schema),
        schema:props.schema
      });
    }
    onValidate(formData, error){
      console.log(['asdfasdfasdfas',this.state.schema]);
      return this.state.validate_fun(formData,error);
    }
    render(){
      const props = {...this.props, validate:this.onValidate.bind(this)};
      return (<FormComponent {
          ...props
      }>{this.props.children}</FormComponent>);
    }
  }
  return Extended;
}

export default inline_validation_extension;
