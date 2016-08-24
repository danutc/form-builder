function formData2schema(formData){
  if(typeof(formData)=='string'){
    return {
      type:'string'
    };
  }
  if(typeof(formData)=='number'){
    return {
      type:'number'
    };
  }
  if(Array.isArray(formData)){
    return {
      type: 'array',
      items: formData2schema(formData[0])
    };
  }
  if(typeof(formData)=='object'){
    return {
      type: 'object',
      properties: Object.keys(formData).reduce((s,a)=>{
        s[a]=formData2schema(formData[a]);
        return s;
      },{})
    };
  }
}
