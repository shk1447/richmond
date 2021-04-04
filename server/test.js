const fs = require('fs')
const Type = require('../TypedJson/server.js').Type;

var schema = new Type({
  id:'uint'
})

var data = {id:42};
fs.writeFileSync('test.bson',schema.encode(data));

fs.writeFileSync('test.json',JSON.stringify(data));