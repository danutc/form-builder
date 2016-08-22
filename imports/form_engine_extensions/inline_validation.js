import React from 'react';


function build_validator(schema){
  let validator = function(schema,error){return error;};
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
      return [name,build_validator(schema.properties[name])];
    });
    return function(formData,errors){
      errors = children_validators.reduce(function(e, c){
        e[c[0]] = c[1](formData[c[0]],e[c[0]]);
        return e;
      }, errors);
      errors = validator(formData, errors);
      return errors;
    };
  }

  return validator;
}


function inline_validation_extension(FormComponent){
  class Extended extends React.Component{
    constructor(props) {
      super(props);
      //this.state={validate:  build_validator(props.schema)};
      //console.log('--------------------');
    }
    render(){
      let validate = build_validator(this.props.schema);
      const props = Object.assign({},this.props);
      props.validate = validate;
      return (<FormComponent {
          ...props
      }>{this.props.children}</FormComponent>);
    }
  }
  return Extended;
}

export default inline_validation_extension;
