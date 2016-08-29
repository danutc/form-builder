import React from 'react';

import { expect } from 'chai';
import { Simulate } from 'react-addons-test-utils';

import rewire from 'rewire';
import deepcopy from 'deepcopy';
import deepmerge from 'deepmerge';

/*
describe('Array Validation', () => {
  const inline_validation = rewire('../src/form_engine_extensions/inline_validation.js');
  const form_engine_validation = rewire('../node_modules/react-jsonschema-form/lib/validate.js');
  const build_validator = inline_validation.__get__('build_validator');
  const createErrorHandler = form_engine_validation.__get__('createErrorHandler');
  const schema = {
    'type':'array',
    'items':{
      'type':'object',
      'preperties':{}
    }
  };
  const data = {
    array: undefined,
  };

  const createErrorHandler(data);

  it('foo',()=>{
    expect('aa').eq('aa');
  });
});

*/
/*
describe('Conditional Logic', () => {
  const conditional_logic = rewire('../src/form_engine_extensions/conditional_logic.js');
  const compile_contition = conditional_logic.__get__('compile_contition');
  it('should hide properties correctly',()=>{
    const schema = {
      type:'object',
      conditional:[
        {clause:'true',properties:['foo']},
        {clause:'false',properties:['bar']}
      ],
      properties:{
        foo:{
          type:'string'
        },
        bar:{
          type:'string'
        }
      }
    };
    const data={};
    const f = compile_contition(schema);
    const ui = f(data);
    console.log(ui);
    expect(ui.bar['ui:widget']).eq('hidden');
    expect(ui.foo).to.be.undefined;
  });
  it('should hide properties base on condition',()=>{
    const schema = {
      type:'object',
      conditional:[
        {clause:'this.foo === "foo"',properties:['foo']},
        {clause:'this.bar === "bar"',properties:['bar']}
      ],
      properties:{
        foo:{
          type:'string'
        },
        bar:{
          type:'string'
        }
      }
    };
    const f = compile_contition(schema);
    const data1={
      foo:'not foo',
      bar:'bar'
    };
    const ui1 = f(data1);
    expect(ui1.foo['ui:widget']).eq('hidden');
    expect(ui1.bar).to.be.undefined;

    const data2={
      foo:'foo',
      bar:'not bar'
    };
    const ui2 = f(data2);
    expect(ui2.bar['ui:widget']).eq('hidden');
    expect(ui2.foo).to.be.undefined;

    const data3={
      foo:'foo',
      bar:'bar'
    };
    const ui3 = f(data3);
    expect(ui3.foo).to.be.undefined;
    expect(ui3.bar).to.be.undefined;


    const data4={
      foo:'not foo',
      bar:'not bar'
    };
    const ui4 = f(data4);
    expect(ui4.foo['ui:widget']).eq('hidden');
    expect(ui4.bar['ui:widget']).eq('hidden');
  });

  it('should handle undefined properly',()=>{
    const schema = {
      type:'object',
      conditional:[
        {clause:'this.foo',properties:['foo']},
        {clause:'this.bar',properties:['bar']}
      ],
      properties:{
        foo:{
          type:'object',
          properties:{
            bar:{
              type:'string'
            }
          }
        },
        bar:{
          type:'string'
        }
      }
    };
    const f = compile_contition(schema);
    const ui2=f(undefined);
    const ui=f({foo:{bar:undefined}});
  });

  it('should support nested object',()=>{
    const schema = {
      type:'object',
      properties:{
        foo:{
          type:'object',
          properties:{
            bar:{
              type:'string'
            }
          }
        },
        bar:{
          type:'boolean'
        }
      }
    };

    ((schema)=>{
      schema.conditional = [{clause:'this.bar',properties:['foo']}];
      const f = compile_contition(schema);
      const ui = f({bar:false});
      expect(ui.foo['ui:widget']).eq('hidden');
    })(deepcopy(schema));

    ((schema)=>{
      schema.properties.foo.conditional = [{clause:'false',properties:['bar']}];
      const f = compile_contition(schema);
      const ui = f({});
      console.log(ui);
      expect(ui.foo.bar['ui:widget']).eq('hidden');
    })(deepcopy(schema));

    ((schema)=>{
      schema.properties.foo.conditional = [{clause:'false',properties:['bar']}];
      const f = compile_contition(schema);
      const ui = f({});
      console.log(ui);
      expect(ui.foo.bar['ui:widget']).eq('hidden');
    })(deepcopy(schema));

  });

  it('should not navigate into a hidden object',()=>{
    const schema = {
      type:'object',
      conditional:[{clause:'this.bar',properties:['foo']}],
      properties:{
        foo:{
          type:'object',
          conditional:[{clause:'false',properties:['bar']}],
          properties:{
            bar:{
              type:'string'
            }
          }
        },
        bar:{
          type:'boolean'
        }
      }
    };
    const f = compile_contition(schema);
    const ui = f({bar:false});
    expect(ui.foo['ui:widget']).eq('hidden');
    expect(ui.foo.bar).to.be.undefined;

    const ui2 = f({bar:true});
    expect(ui2.foo['ui:widget']).to.be.undefined;
    expect(ui2.foo.bar['ui:widget']).eq('hidden');
  });
  it('should support fix array',()=>{
    const f = compile_contition({
      type:'array',
      items:[
        {
          type:'object',
          conditional:[{clause:'this.bar',properties:['bar']}],
          properties:{
            bar:{
              type:'boolean'
            }
          }
        },{
          type:'object',
          conditional:[{clause:'this.bar',properties:['bar']}],
          properties:{
            bar:{
              type:'boolean'
            }
          }
        }
      ]
    });
    const ui = f([{bar:true},{bar:false}]);
    expect(ui).to.be.instanceof(Array);
    expect(ui.length).eq(2);
    expect(ui[0].bar).to.be.undefined;
    expect(ui[1].bar['ui:widget']).eq('hidden');

    const ui2 = f([{bar:false},{bar:true}]);
    expect(ui2).to.be.instanceof(Array);
    expect(ui2.length).eq(2);
    expect(ui2[0].bar['ui:widget']).eq('hidden');
    expect(ui2[1].bar).to.be.undefined;
  });
});
*/
describe('Conditional Data filter', () => {
  const conditional_logic = rewire('../src/form_engine_extensions/conditional_logic.js');
  const compile_datafilter = conditional_logic.__get__('compile_datafilter');

  it('should delete form properties which don\'t meet the condition',()=>{
    const f = compile_datafilter({
      type:'object',
      conditional:[
        {clause:'true',properties:['foo']},
        {clause:'false',properties:['bar']}
      ],
      properties:{
        foo:{
          type:'string'
        },
        bar:{
          type:'string'
        }
      }
    });
    const data = f({
      foo:'foo',
      bar:'bar'
    });
    expect(data).to.have.ownProperty('foo');
    expect(data).not.to.have.ownProperty('bar');
  });
  it('should support nested object',()=>{
    const schema = {
      type:'object',
      properties:{
        foo:{
          type:'object',
          properties:{
            bar:{
              type:'string'
            }
          }
        },
        bar:{
          type:'boolean'
        }
      }
    };
    ((schema)=>{
      schema.conditional = [{clause:'this.bar',properties:['foo']}];
      const f = compile_datafilter(schema);

      const data = f({bar:false,foo:{bar:'data'}});
      expect(data).not.to.have.ownProperty('foo');

      const data2 = f({bar:true,foo:{bar:"data"}});
      expect(data2.foo.bar).eq('data');
    })(deepcopy(schema));

    ((schema)=>{
      schema.properties.foo.conditional = [{clause:'false',properties:['bar']}];
      const f = compile_datafilter(schema);
      const data = f({bar:false,foo:{bar:'data'}});
      expect(data.foo).not.to.have.ownProperty('bar');

    })(deepcopy(schema));

    ((schema)=>{
      schema.properties.foo.conditional = [{clause:'true',properties:['bar']}];
      const f = compile_datafilter(schema);
      const data = f({bar:false,foo:{bar:'data'}});
      expect(data.foo.bar).eq('data');
    })(deepcopy(schema));
  });

});
