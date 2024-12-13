const sqlite3 = require("sqlite3").verbose();

//Create words table
const createWordsTable = (db) => {
    db.run("CREATE TABLE words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);");
};

//Create translations table
const createTranslationsTable = (db) => {
    db.run(`CREATE TABLE translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        translations text,
        FOREIGN KEY (word_id) REFERENCES words (id)
    );`);
    /* This may become confusing at first, but we'll see how it pans out when I get to use it in the
    frontend. Will need some handling. Case sensitivity, I will handle in the frontend and will most likely
    force all posted words to be in lowercase */
};

// Initialize the database to RAM
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    db.serialize(() => {
        createWordsTable(db);
        createTranslationsTable(db);

        db.run("INSERT INTO words (word) VALUES ('hello'), ('terve'), ('hi')")
            .run("INSERT INTO translations (word_id, translations) VALUES (1, '2,3'), (2, '1'), (3, '1');");
        /* Eventually, I will read off all the initial data from a file. Hardcoding should do
        for now. For saving user generated words and translations, I will look into localstorage
        or somehow making this persistent other means */
    });
});

module.exports = db;