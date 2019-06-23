module.exports = {

  query: query,
  getStockData: getStockData
}

//get the mySql object
const mySql = require('mysql')

//object which holds the connection to the db
let connection = null

var stockData;

function handleDisconnect() {
  stockData = mySql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'GayFrogs',
     database: 'stockData'
   });

  stockData.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  stockData.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
/**
 * Create the connection to the db
 */
function initConnection() {

  //set the global connection object
   connection = mySql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'GayFrogs',
    database: 'oAuth2Test'
  })
}

/**
 * executes the specified sql query and provides a callback which is given
 * with the results in a DataResponseObject
 *
 * @param queryString
 * @param callback - takes a DataResponseObject
 */
function query(queryString, callback){

  //init the connection object. Needs to be done everytime as we call end()
  //on the connection after the call is complete
  initConnection()

  //connect to the db
  connection.connect()

  //execute the query and collect the results in the callback
  connection.query(queryString, function(error, results, fields){

      console.log('mySql: query: error is: ', error, ' and results are: ', results);

    //disconnect from the method
    connection.end();

    //send the response in the callback
    callback(createDataResponseObject(error, results))
  })
}

/**
* @param ticker
* @param start
* @param end
**/

function getStockData(ticker, start, end){ return new Promise((resolve,reject) =>{

  startDate = Date.parse(start) || start
  endDate = Date.parse(end) || end

  var frequency = 'minutely'

  if(endDate - startDate > 2592000000 || startDate < Date.parse('2016-12-12')){
    frequency = 'daily'
  }

  var sqlStmt = `SELECT * FROM ${frequency} WHERE ticker = "${ticker}" AND timestamp >= "${new Date(startDate*1).toISOString()}" AND timestamp <= "${new Date(endDate*1).toISOString()}";`;

  stockData.query(sqlStmt, function(error, results, fields){

      var data = []

      for(var i in results){

        data.push([new Date(results[i].timestamp).getTime()-3600*7*1000, results[i].open, results[i].high, results[i].low, results[i].close])

      }

      resolve(data)
    //disconnect from the method
  })
});
}
/**
 * creates and returns a DataResponseObject made out of the specified parameters.
 * A DataResponseObject has two variables. An error which is a boolean and the results of the query.
 *
 * @param error
 * @param results
 * @return {DataResponseObject<{error, results}>}
 */
function createDataResponseObject(error, results) {

    return {
      error: error,
      results: results === undefined ? null : results === null ? null : results
     }
  }
