const db = require("./database.js");
//Import the database

const getAllWords = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM words', (err, rows) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            //If no words found
            if (rows.length === 0) {
                return reject({ status: 404, message: 'No words found' });
            }
            //Resolve returns all taken data
            resolve(rows);
        });
    });
};

const getAllTranslations = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM translations', (err, rows) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            //If no translations found
            if (rows.length === 0) {
                return reject({ status: 404, message: 'No translations found' });
            }
            //Resolve returns all taken data
            resolve(rows);
        });
    });
};

const getWordsById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
            //If something goes wrong in the server
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            //If not found
            if (!row) {
                return reject({ status: 404, message: 'Word not found' });
            }
            //Resolve and give the specific row from database
            resolve(row);
        });
    });
};

const getTranslationsById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
            //If something goes wrong in the server
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            //If not found
            if (!row) {
                return reject({ status: 404, message: 'Tanslations not found' });
            }
            //Resolve and give the specific row from database
            resolve(row);
        });
    });
};

const postWords = (word) => {
    return new Promise((resolve, reject) => {
        //Will refuse if the word is empty. Will also be handled in frontend for redundancy
        if (word.length < 1) {
            return reject({ status: 400, message: 'Word cannot be empty' });
        }
        db.run('INSERT INTO words (word) VALUES (?)', [word], function (err) {
            if (err) {
                /*Handling for unique constraint. Since there is only one constraint,
                you can just use generic SQLITE_CONSTRAIT and don't need to check
                if it contains error for uniqueness*/
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return reject({ status: 409, message: 'Word already exists' });
                }
                return reject({ status: 500, message: err.message });
            }
            //Resolve the word and the last id in the autoincrement
            resolve({ id: this.lastID, word: word });
        });
    });
};


//Export all the modules for the router.js
module.exports = {
    getAllWords,
    getAllTranslations,
    getWordsById,
    getTranslationsById,
    postWords,
};
