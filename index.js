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

  if (query.length !== 0)
    query = removeLastComma(query);

  return query;
}

let removeLastComma = query => query.substring(0, query.length - 2);

let createTableCommand = () => constants.CREATE_TABLE;

let openParanthesis = () => constants.OPEN_PARANTHESIS;

let closeParanthesis = () => constants.CLOSE_PARATHESIS;
