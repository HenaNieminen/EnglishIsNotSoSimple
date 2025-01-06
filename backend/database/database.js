const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

//Create a table to store languages
/*For the time being. I will only make a function to see them all. I will not yet
start implementing support for multiple languages. These are just for error checking so
a word from the same language can't translate to an other word from the same language */
const createLanguageTable = (db) => {
    db.run("CREATE TABLE languages (id INTEGER PRIMARY KEY AUTOINCREMENT, language TEXT UNIQUE);");
};

//Create words table
const createWordsTable = (db) => {
    db.run(`CREATE TABLE words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lang_id INTEGER,
        word TEXT,
        FOREIGN KEY (lang_id) REFERENCES languages (id),
        UNIQUE(lang_id, word)
    );`);
    /*Unique constaint was modified so that words have to be unique for each language,
    but will not exclude and reject loan words in other languages*/
};

//Create translations table
const createTranslationsTable = (db) => {
    db.run(`CREATE TABLE translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        trans_id INTEGER NOT NULL,
        FOREIGN KEY (word_id) REFERENCES words (id),
        FOREIGN KEY (trans_id) REFERENCES words (id),
        UNIQUE(word_id, trans_id)
    );`);
    /*Converted to use duplication. I realized that comma separating them
    will cause headaches in the future. Luckily this is still easily correctable*/
};

//Read the initialData.json file and insert all contents to the database
const createPlaceHolderData = (db) => {
    fs.readFile(__dirname + "/initialData.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        try {
            //Parse and read the data and then insert the each json object
            const { languages, words, translations } = JSON.parse(data);
            //Serialize to make sure they run in order
            db.serialize(() => {
                languages.forEach((language) => {
                    db.run("INSERT INTO languages (language) VALUES (?)", [language], (err) => {
                        if (err) {
                            console.error("Error inserting language:", err);
                        }
                    });
                });

                words.forEach(({ lang_id, word }) => {
                    db.run("INSERT INTO words (lang_id, word) VALUES (?, ?)", [lang_id, word], (err) => {
                        if (err) {
                            console.error("Error inserting word:", err);
                        }
                    });
                });

                translations.forEach(({ word_id, trans_id }) => {
                    db.run("INSERT INTO translations (word_id, trans_id) VALUES (?, ?)", [word_id, trans_id], (err) => {
                        if (err) {
                            console.error("Error inserting translation:", err);
                        }
                    });
                });
            });
        } catch (parseError) {
            console.error("Error parsing file:", parseError);
        }
    });
};

const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Database creation failed:", error);
        return;
    }
    //Run all database initializations in a series
    db.serialize(() => {
        createLanguageTable(db);
        createWordsTable(db);
        createTranslationsTable(db);
        createPlaceHolderData(db);
    });
});


/*NOTES:
The database needs to be persisted somehow. The initial idea is to store it in browser localstorage,
but a lot of people say it is haram and generally frowned upon. Honestly, I have no clue how to make a solid
database that is unique for each user without having to resort to storing it locally in someones browser.
This will probably change a lot coming along, but at least the final structure is somewhat there, (could do with
a language table for future expansion) and the functions are somewhat nailed down already.


Found a solution: IndexedDB. This restufl api will only run the defaults for the user, but when making changes into
the database, IndexedDB will also save those changes in the frontend and will also take the default values if empty.
When the user loads up the web app again, the indexedDB will scan the database, force add its own values that the user
has manipulated the database with in the past.
*/

module.exports = db;
