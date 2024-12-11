const sqlite3 = require("sqlite3").verbose();

//Initialize the database to ram
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    db.serialize(() => {
        db.run("CREATE TABLE words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);")
            .run(`CREATE TABLE translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                translations text,
                FOREIGN KEY (first_word_id) REFERENCES words (id),
            );`)
            /*Translations stores all the IDs of the words that match comma separated.
            this will need some handling or a better idea*/
            .run("INSERT INTO words (word) VALUES ('hello'), ('terve');");
    });
});

module.exports = db;