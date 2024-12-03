const sqlite3 = require("sqlite3").verbose();

//Initialize the database to ram
const db = new sqlite3.Database(":memory:", (error) => {

});