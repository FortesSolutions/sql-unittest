var assert = require('assert');
var sqlite3 = require('sqlite3').verbose();

let instantiateDb = () => {
    return new sqlite3.Database(':memory:');
}

