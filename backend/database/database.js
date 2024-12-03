const sqlite3 = require("sqlite3").verbose();

//Initialize the database to ram
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    db.serialize(() => {
        /*Decided to keep it simple for now. This will only support a single language and definition
        and may not even work from the get go. Idea to expand this would be to add a separate translations
        table which I will implement later*/
        db.run("CREATE TABLE wordpairs (id INTEGER PRIMARY KEY AUTOINCREMENT, words TEXT);")
            .run("INSERT INTO wordpairs (words) VALUES ('hello, terve');")
    });
});

module.exports = db;