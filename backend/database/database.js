const sqlite3 = require("sqlite3").verbose();

//Initialize the database to ram
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    db.serialize(() => {
        db.run("CREATE TABLE wordpairs (id INTEGER PRIMARY KEY, wordpair TEXT)");
    });
});

module.exports = { db };