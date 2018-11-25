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
    query += ", ";
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
    await dbRunQuery(db, queries[i], []);
}

let execute = async(db, query, param) => {
  let result = await dbRunQuery(db, query, param);
  
  return result; 
}

let deleteAll = async(db, tableName) => {
  let query = deleteAllCommand() + tableName;

  await db.run(query);
}

let runQuery = async(db, query, param) => {
  let result = await dbRunQuery(db, query, param);
  
  return result; 
}

let runDataManipulationQuery = async(db, tableName, query, param) => {

  await dbRunQuery(db, query, param);

  let result = await selectAllFromTable(db, tableName);
  return result;
}

let selectAllFromTable = async(db, tableName) => {
  let query = selectAllCommand() + tableName;

  let result = await dbrunQuery(db, query);
  return result;
}

let closeDb = db => {
  db.close();
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
  queryValuePart = removeLastCommaAtEnd(queryValuePart);

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

let closeParanthesis = () => constants.CLOSE_PARANTHESIS;

let deleteAllCommand = () => constants.DELETE_ALL;

let selectAllCommand = () => constants.SELECT_ALL_COMMAND;

const AssertLength = (results, expectedLength) => {
  if(results.length === expectedLength)
    return assert.ok(true, "Actual number of records is equivalent to expected value");
  else
    return assert.ok(false, "Actual number of records is " + results.length);
}

const AssertContains = (results, expected) => {
  
  if(containsExpected(results, expected))
    return assert.ok(true, "The given record is present in results");
  else
    return assert.ok(false, "The given record is not present in results");
}

const AssertNotContains = (results, expected) => {

  if (notContainsExpected(results, expected))
    return assert.ok(true, "The given record is not present in results");
  else
    return assert.ok(false, "The given record is present in results");
}

const notContainsExpected = (results, expected) => {
  for (var eKey in expected) {
    
    if(!containsExpectedKey(eKey, expected[eKey], results))
      return true;
  }

  return false;
}

const containsExpected = (results, expected) => {
  for(var eKey in expected) {
    
    if(!containsExpectedKey(eKey, expected[eKey], results))
      return false;
  }

  return true;
}

const containsExpectedKey = (key, value, results) => {
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
  deleteAll: deleteAll,
  execute: execute,
  closeDb: closeDb,
  AssertContains: AssertContains,
  AssertNotContains: AssertNotContains,
  AssertLength: AssertLength,
  runDataManipulationQuery: runDataManipulationQuery,
  runQuery: runQuery
}
