var mysql = require("mysql");

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "relational.fit.cvut.cz",
  user: "guest",
  password: "relational",
  database: "financial",
  port: 3306,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query("select * from loan limit 10", function (err, results) {
  if (err) throw err;
  for (const result of results) {
    console.log(result);
  }
});
