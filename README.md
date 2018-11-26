# SQL Queries Unit Testing

A package for writing unit tests for SQL queries.

## Usage

This package allows assert methods for writing unit tests for sql queries to check number of records and whether an object is present or not in the results of the test query.

The package simulates a databse instance to allow it to fill with mock tables and data relevant to the query being tested. 
Then, the test query can be run against this instance created and get the results.
Then unit tests can be written.

Following steps are required to write unit tests in before hook in mocha.
1) First a db instance needs to be created ( instantiateDb())

2) Create the tables relevant to the query being tested (createTable()).

3) Insert the data in the table. (insert())

4) Run the query being tested depending on the type. If the query being tested is select query then use either execute() or runQuery() and if its insert update or delete use runDataManiulationQuery(). (execute(), runQuery() or runDataManipulationQuery())

For the unit tests following asserts are provided
1) assertLength -> Check whether the number of records in the results of test query is equal to the given value.

2) assertContains -> Check whether the given object is present in the results of the test query.

3) assertNotContains -> Check whether the given object is not present in the results of the test query.

Then in after hook
1) Close the db conncection (closeDb())


## List of Functions

### instantiateDb()  
instantiate mock database.

#### Return  
     Returns the database instance created.


### createTable(databaseName, tableName, tableSchema)  
creates table in the database specified by databaseName. 

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.  
     tableName -> should be a string specifing the name of table to be created.  
     tableSchema -> should be a JSON object with column names as keys and column data type as values.


### insert(databaseName, tableName, data)  
inserts data in the database specified by databaseName

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.  
     tableName -> should be a string specifing the name of table to be created.  
     data -> should be an array of JSON objects with column names as keys and value of that column name as values for the JSON object.


### execute(databaseName, testQuery, testQueryParameters)   
runs the testQuery with testQueryParameters

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.   
     testQuery -> the query being tested enclosed within ``.  
     testQueryParameters(optional) -> if the testQuery contains parameters, they can be passed as an array.

#### Return  
     Returns the results got after running the test query.

### runQuery(databaseName, testQuery, testQueryParameters)   
runs the testQuery with testQueryParameters

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.   
     testQuery -> the query being tested enclosed within ``.  
     testQueryParameters(optional) -> if the testQuery contains parameters, they can be passed as an array.

#### Return  
     Returns the results got after running the test query.

### runDataManipulationQuery(databaseName, tableName, testQuery, testQueryParameters)   
runs the testQuery with testQueryParameters

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.   
     tableName -> the name of table which is being manipulated in test query.
     testQuery -> the query being tested enclosed within ``.  
     testQueryParameters(optional) -> if the testQuery contains parameters, they can be passed as an array.

#### Return  
     Returns all the records of the table which is being manipulated in the test query.


### closeDb(databaseName)  
close the database connection

#### Parameters  
     databaseName -> should be the database instance created by instantiateDb function.

### deleteAll(databaseName, tableName)   
deletes all the records from the table

#### Parameters   
     databaseName -> should be the database instance created by instantiateDb function.   
     tableName -> the name of table.
     
### AssertContains(results, searchObject)  
asserts that the searchObject is present in the test query results.

#### Parameters  
     results -> Array of records.  
     searchObject -> JSON object to be searched in the results array.


### AssertNotContains(results, searchObject)   
asserts that the searchObject is not present in the test query results.

#### Parameters  
     results -> Array of records.  
     searchObject -> JSON object to be searched in the results array.


### AssertLength(results, expectedLength)   
checks whether the number of records is equal to the expected length.

#### Parameters  
     results -> Array of records.  
     expectedLength -> integer denoting the expected number of records.

  
## Example

Below is an example of a test suite with mocha framework.

Suppose you want to write unit tests for a query which fetches all records of table "contacts" with "Name" and "PhoneNumber" as columns and contains 2 records.
Then, test cases can be written to check the number of records returned and to check whether a given record is present or not in the result generated by running test query.

``` js

let unitTest = require('sql-unittest');

//Test suite
describe('Testing contacts select query', () => {

    let db;
    let testSelectQuery = 'SELECT * FROM contacts';
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
        let db = unitTest.instantiateDb();

        //create table
        await unitTest.createTable(db, "contacts", schema);

        //insert data in table
        await unitTest.insert(db, "contacts", data);

        //Run the query being tested
        testQueryResult = await unitTest.runQuery(db, testQuery, []);
    });
    
    after(function(){
        unitTest.closeDb(db);
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

Suppose you want to write unit tests for a query which deletes a user with Test1 Name from table "contacts" .
Then, test cases can be written to check the number of records left and to check whether the record supposed to be deleted is deleted from the table.

``` js

describe('Testing contacts delete query', () => {

    let db;
    let testDeleteQuery = 'DELETE FROM contacts';
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
        let db = unitTest.instantiateDb();

        //create table
        await unitTest.createTable(db, "contacts", schema);

        //insert data in table
        await unitTest.insert(db, "contacts", data);

        //Run the query being tested
        testQueryResult = await unitTest.runDataManipulationQuery(db, "contacts", testQuery, ['Test2']);
    });
    
    after(function(){
        unitTest.closeDb(db);
    });

    //Test Cases
    it('should verify that number of records returned by the testquery is 2', async() => {
        unitTest.AssertLength(testQueryResult, 1);    
    });

    it('should not contain the given user in the results from running test query', async() => {
        unitTest.AssertNotContains(testQueryResult, {Name: 'Test2'});    
    });
});

```




