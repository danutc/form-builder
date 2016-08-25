const schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'configs': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string'
        },
      }
    },
    'ui':{
      'type':'object',
      'properties':{
        'classNames':{
          'type':'string'
        },
        'ui:widget':{
          'type':'string'
        }
      }
    }
  }
};


export default schema;
