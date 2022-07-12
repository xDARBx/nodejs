let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'baibnzngtd2xyd4hbrfk-mysql.services.clever-cloud.com',
  user     : 'uy4mcrsgljkazc9s',
  password : 'JhIsFqFbDyY0k5r8f3hx',
  database : 'baibnzngtd2xyd4hbrfk',
  port: 3306
});
 
connection.connect(function(error) {
    if (error) throw error
    console.log("DB conectada (ONLINE)")
});
 
/* connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
}); */
 
// connection.end();

module.exports = connection