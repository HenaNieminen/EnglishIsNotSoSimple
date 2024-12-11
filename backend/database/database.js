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
                word_id INTEGER NOT NULL,
                translations text,
                FOREIGN KEY (word_id) REFERENCES words (id)
            );`)
            /*Translations stores all the IDs of the words that match comma separated.
            this will need some handling or a better idea*/
            .run("INSERT INTO words (word) VALUES ('hello'), ('terve');");
        /*Eventually, I will read off all the initial data from a file. Hardcoding should do
        for now. For saving user generated words and translations, I will look into localstorage
        or somehow making this persistant other means */
    });
});

module.exports = db;