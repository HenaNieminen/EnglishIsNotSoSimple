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
        db.get('SELECT * FROM translations WHERE id = ?', [id], (err, row) => {
            //If something goes wrong in the server
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            //If not found
            if (!row) {
                return reject({ status: 404, message: 'Translations not found' });
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
                /*On a second thought, it might be a good idea to define the constraint
                anyways.*/
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    return reject({ status: 409, message: 'Word already exists' });
                }
                return reject({ status: 500, message: err.message });
            }
            //Resolve the word and the last id in the autoincrement
            resolve({ id: this.lastID, word: word });
        });
    });
};

const postTranslations = (id, transIds) => {
    return new Promise((resolve, reject) => {
        //Will refuse if any value is empty
        if (!id || transIds.length === 0) {
            return reject({ status: 400, message: 'Values cannot be empty' });
        }
        //Split the given transIds to an number array
        const transArray = transIds.split(',').map(Number);
        //Check if the id for the word exists
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, wordRow) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!wordRow) {
                return reject({ status: 404, message: 'Word not found' });
            }
            //Map out how many ? marks are needed to make the Select statement from transArray
            const queryMarks = transArray.map(() => '?').join(',');
            //Check if the ids of the transIds exist in the words table
            db.all(`SELECT id FROM words WHERE id IN (${queryMarks})`, transArray, (err, rows) => {
                if (err) {
                    return reject({ status: 500, message: err.message });
                }
                //If the query does not return the full length of transArray, some word must be missing
                if (rows.length !== transArray.length) {
                    return reject({ status: 404, message: 'One or more given word translations not found' });
                }
                //Run the insert after all checks
                db.run('INSERT INTO translations (word_id, translations) VALUES (?, ?)', [id, transIds], function (err) {
                    if (err) {
                        //Handling for unique constraint
                        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                            const message = "Translations for this word already exist. Please use PATCH or PUT to edit them"
                            return reject({ status: 409, message: message });
                        }
                        return reject({ status: 500, message: err.message });
                    }
                    //Resolve if all goes well
                    resolve({ id: this.lastID, transIds: transIds });
                });
            });
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
    postTranslations
};
