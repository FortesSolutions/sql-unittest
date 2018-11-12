# SQL Queries Unit Testing

A package for writing unit tests for SQL queries.

## Example

Below is an example of a test suite with mocha framework.

Suppose you are creating a table "contacts" with "Name" and "PhoneNumber" as columns and the table contains 2 records.

``` js

let unitTest = require('sql-unittest');

describe('Testing contacts query', () => {

    let db;
    let testQuery = 'SELECT * FROM contacts';
    let testQueryResult;

    let schema = {
        Name: 'TEXT',
        PhoneNumber: 'NUMERIC', 
    };

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

        testQueryResult = await unitTest.execute(db, testQuery, []);
    });
    
    after(function(){
        db.close();
    });

    it('should verify that number of records returned by the testquery is 2', async() => {
        unitTest.AssertLength(testQueryResult, 2);    
    });

    it('should contain the given user', async() => {
        unitTest.AssertContains(results, {Name: 'Test1', PhoneNumber: 1234567890});    
    });

    it('should not contain the given user', async() => {
        unitTest.AssertContains(results, {Name: 'Test3'});    
    });

});

```




