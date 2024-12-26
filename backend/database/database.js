const sqlite3 = require("sqlite3").verbose();

//Create words table
const createWordsTable = (db) => {
    db.run("CREATE TABLE words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT UNIQUE);");
};

//Create translations table
const createTranslationsTable = (db) => {
    db.run(`CREATE TABLE translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        translation_id INTEGER NOT NULL,
        FOREIGN KEY (word_id) REFERENCES words (id),
        FOREIGN KEY (translation_id REFRENCES words (id),
        UNIQUE(word_id, translation_id)
    );`);
    /*Converted to use duplication. I realized that comma separating them
    will cause headaches in the future. Luckily this is still easily correctable*/
};

const createPlaceHolderData = (db) => {
    db.run("INSERT INTO words (word) VALUES ('hello'), ('terve'), ('hi')")
        .run("INSERT INTO translations (word_id, translation_id) VALUES (1, 2), (1, 3), (2, 1), (3, 1);");
    /* Eventually, I will read off all the initial data from a file. Hardcoding should do
    for now. For saving user generated words and translations, I will look into localstorage
    or somehow making this persistent other means */
}

// Initialize the database to RAM
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    db.serialize(() => {
        createWordsTable(db);
        createTranslationsTable(db);
        createPlaceHolderData(db);
    });
});



module.exports = db;