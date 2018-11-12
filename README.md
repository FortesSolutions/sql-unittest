# SQL Queries Unit Testing

A package for writing unit tests for SQL queries.

## List of Functions

  1) instantiateDb() -> instantiate mock database.

  ##### Return
     Returns the database instance created.

  2) createTable(databaseName, tableName, tableSchema) -> creates table in the database specified by databaseName. 

  ##### Parameters
     databaseName -> should be the database instance created by instantiateDb function.
     tableName -> should be a string specifing the name of table to be created.
     tableSchema -> should be a JSON object with column names as keys and column data type as values.

  3) insert(databaseName, tableName, data) -> inserts data in the database specified by databaseName

  ##### Parameters
     databaseName -> should be the database instance created by instantiateDb function.
     tableName -> should be a string specifing the name of table to be created.
     data -> should be an array of JSON objects with column names as keys and value of that column name as values for the JSON object.

  execute(databaseName, testQuery, testQueryParameters) -> runs the testQuery with testQueryParameters
  AssertContains: AssertContains,
  AssertNotContains: AssertNotContains,
  AssertLength: AssertLength

## Example

Below is an example of a test suite with mocha framework.

Suppose you want to write unit tests for a query which fetches all records of table "contacts" with "Name" and "PhoneNumber" as columns and contains 2 records.
Then, test cases can be written to check the number of records returned and to check whether a giver record is present or not in the result generated by running test query.

``` js

let unitTest = require('sql-unittest');

//Test suite
describe('Testing contacts query', () => {

    let db;
    let testQuery = 'SELECT * FROM contacts';
    let testQueryResult;

    //Table Schema
    let schema = {
        Name: 'TEXT',
        PhoneNumber: 'NUMERIC', 
    };

    //Mock data
    let data = [
        {
            Name: 'Test1',
            PhoneNumber: 1234567890
        },
        {
            Name: 'Test2',
            PhoneNumber: 0987654321
        }
    ];

    before(async () => {  

        //instantiate a new db instance
        let db = utest.instantiateDb();

        //create table
        await unitTest.createTable(db, "contacts", schema);

        //insert data in table
        await unitTest.insert(db, "contacts", data);

        //Run the query being tested
        testQueryResult = await unitTest.execute(db, testQuery, []);
    });
    
    after(function(){
        db.close();
    });

    //Test Cases
    it('should verify that number of records returned by the testquery is 2', async() => {
        unitTest.AssertLength(testQueryResult, 2);    
    });

    it('should contain the given user in the results from running test query', async() => {
        unitTest.AssertContains(testQueryResult, {Name: 'Test1', PhoneNumber: 1234567890});    
    });

    it('should not contain the given user in the results from running test query', async() => {
        unitTest.AssertNotContains(testQueryResult, {Name: 'Test3'});    
    });

});

```




