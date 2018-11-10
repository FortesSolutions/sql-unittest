var assert = require('assert');
var sqlite3 = require('sqlite3').verbose();
var constants = require('./constants.js');

let instantiateDb = () => {
  return new sqlite3.Database(':memory:');
}

let createTable = async (db, tableName, schema) => {
  let query = createTableCommand() + tableName + openParanthesis();

  query += addColumns(schema);
  query += closeParanthesis();

  await db.run(query);
}

let addColumns = schema => {
  let query = "";

  for (key in schema) {
    query += key + " ";
    query += schema[key];
    query += query + ", ";
  }

  query = removeLastCommaAtEnd(query);

  return query;
}

let insert = async(db, tableName, data) => {
  let queries = [];
 
  data.forEach(function(value){
    let queryColumnNamePart = insertCommand() + tableName + openParanthesis();
    let queryValuePart = valueCommand() + openParanthesis();

    let insertData = queryInsertData(value);

    queryColumnNamePart += insertData.queryColumnNamePart;
    queryValuePart += insertData.queryValuePart;
    
    queryColumnNamePart += closeParanthesis();
    queryValuePart += closeParanthesis();

    queries.push(queryColumnNamePart + queryValuePart);    
  });

  for(var i in queries)
    await dbRunQuery(db, query[i], []);
}

let execute = async(db, query, param) => {
  let result = await dbRunQuery(db, query, param);
  
  return result; 
}

const dbRunQuery = (db, query, param) => new Promise((resolve, reject) => {
  db.all(query,param, (err, out) => {
    if (err !== null) return reject(err);

    resolve(out);
  });
});

let queryInsertData = value => {
  let queryColumnNamePart = "";
  let queryValuePart = "";

  for (var key in value){
    queryColumnNamePart += key + ", ";

    if (!isString(value[key]))
      queryValuePart += value[key] + ", ";
    else
      queryValuePart += "\'" + value[key] + "\'" + ", ";
  }

  queryColumnNamePart = removeLastCommaAtEnd(queryColumnNamePart);
  queryValuePart = removeLastCommaAtEnd(queryValue);

  return {
    queryColumnNamePart: queryColumnNamePart,
    queryValuePart: queryValuePart
  }

}

let isString = value => {
  return typeof value !== 'string' ? false:true
}

let removeLastCommaAtEnd = query => {

  if(query.length !== 0)
    return query.substring(0, query.length - 2);

  return query;
}

let createTableCommand = () => constants.CREATE_TABLE;

let insertCommand = () => constants.INSERT;

let valueCommand = () => constants.VALUES;

let openParanthesis = () => constants.OPEN_PARANTHESIS;

let closeParanthesis = () => constants.CLOSE_PARATHESIS;

const AssertLength = (results, expectedLength) => {
  if(results.length === expectedLength)
    return assert.ok(true, "Actual number of records is equivalent to expected value");
  else
    return assert.ok(false, "Actual number of records is " + results.length);
}

const AssertContains = (results, expected) => {
  if(containExpected(results, expected))
    return assert.ok(true, "Record present");
  else
    return assert.ok(false, "Records not present");
}

const containsExpected = (results, expected) => {
  for(var eKey in expected) {
    
    if(!containExpectedKey(eKey, expected[eKey], results))
      return false;
  }

  return true;
}

const containExpectedKey = (key, value, results) => {
  for(var i in results){
    
    if(results[i].hasOwnProperty(key) && results[i][key] === value)
      return true;
  }

  return false;
}

module.exports = {
  instantiateDb: instantiateDb,
  createTable: createTable,
  insert: insert,
  execute: execute,
  AssertContains: AssertContains,
  AssertLength: AssertLength
}
