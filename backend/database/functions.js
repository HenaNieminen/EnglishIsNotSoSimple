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

//Probably an useless function. Will most likely be deleted later
const getTranslationsById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM translations WHERE id = ?', [id], (err, row) => {
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

//The real shit frontend actually needs
const getTranslationsByWordId = (id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM translations WHERE word_id = ?', [id], (err, rows) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (rows.length === 0) {
                return reject({ status: 404, message: 'Translations not found' });
            }
            resolve(rows);
        });
    });
}

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

const postTranslations = (id, transId) => {
    return new Promise((resolve, reject) => {
        //Reject if any value is empty
        if (!id || !transId) {
            return reject({ status: 400, message: 'Values cannot be empty' });
        }

        //Check if the word id exists
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, wordRow) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!wordRow) {
                return reject({ status: 404, message: 'Word not found' });
            }
            //See if word transID exists
            db.get('SELECT * FROM words WHERE id = ?', [transId], (err, transRow) => {
                if (err) {
                    return reject({ status: 500, message: err.message });
                }
                if (!transRow) {
                    return reject({ status: 404, message: 'Translation word not found' });
                }
                //Add the translation
                db.run('INSERT INTO translations (word_id, translation_id) VALUES (?, ?)', [id, transId], function (err) {
                    if (err) {
                        if (err.message.includes('UNIQUE')) {
                            return reject({ status: 409, message: 'Translation already exists' });
                        }
                        return reject({ status: 500, message: err.message });
                    }
                    /*Add the translation other way around. This was harder to figure out with
                    comma separation hence the change.*/
                    db.run('INSERT INTO translations (word_id, translation_id) VALUES (?, ?)', [transId, id], function (err) {
                        if (err) {
                            if (err.message.includes('UNIQUE')) {
                                return reject({ status: 409, message: 'Reverse translation already exists' });
                            }
                            return reject({ status: 500, message: err.message });
                        }
                        resolve({ id: this.lastID, wordId: id, transId: transId });
                    });
                });
            });
        });
    });
};

const deleteWord = (id) => {
    return new Promise((resolve, reject) => {
        //Check if the word exists first before executing
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!row) {
                return reject({ status: 404, message: 'Word not found' });
            }
            //Delete the word from the database
            db.run('DELETE FROM words WHERE id = ?', [id], function (err) {
                if (err) {
                    return reject({ status: 500, message: err.message });
                }
                //Delete any translation related to the word
                db.run('DELETE FROM translations WHERE word_id = ? OR translation_id = ?', [id, id], function (err) {
                    if (err) {
                        return reject({ status: 500, message: err.message });
                    }
                    resolve();
                });
            });
        });
    });
};

const deleteTranslation = (id, transId) => {
    return new Promise((resolve, reject) => {
        //Check if the translation exists first before executing
        db.get('SELECT * FROM translations WHERE word_id = ? AND translation_id = ?', [id, transId], (err, row) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!row) {
                return reject({ status: 404, message: 'Translation not found' });
            }
            //Delete the initial translation
            db.run('DELETE FROM translations WHERE word_id = ? AND translation_id = ?', [id, transId], function (err) {
                if (err) {
                    return reject({ status: 500, message: err.message });
                }
                //And the ol' switcheroo
                db.run('DELETE FROM translations WHERE word_id = ? AND translation_id = ?', [transId, id], function (err) {
                    if (err) {
                        return reject({ status: 500, message: err.message });
                    }
                    resolve();
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
    getTranslationsById, //This might be an useless function
    getTranslationsByWordId,
    postWords,
    postTranslations,
    deleteWord,
    deleteTranslation,
};
