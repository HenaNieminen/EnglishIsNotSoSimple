const db = require("./database.js");
//Import the database
const joi = require("joi");
//Import joi


//Schemas for joi validation
const wordSchema = joi.object({
    lang_id: joi.number().integer().required(),
    /*Words regex will need some work. Numbers will probably need their own table and language but we will figure it out later*/
    word: joi.string().pattern(/^[a-zA-Z-' ]+$/).required(),
});

const transSchema = joi.object({
    word_id: joi.number().integer().required(),
    trans_id: joi.number().integer().required(),
});

const getAllLanguages = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM languages', (err, rows) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            //If no languages found (Would be pretty weird huh?)
            if (rows.length === 0) {
                reject({ status: 404, message: 'No languages found' });
                return;
            };
            resolve(rows);
        });
    });
};

const getLanguageById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM languages WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            if (!row) {
                reject({ status: 404, message: 'Inserted language not found' });
                return;
            };
            resolve(row);
        });
    });
};

const getAllWords = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM words', (err, rows) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            //If no words found
            if (rows.length === 0) {
                reject({ status: 404, message: 'No words found' });
                return;
            };
            //Resolve returns all taken data
            resolve(rows);
        });
    });
};

const getAllTranslations = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM translations', (err, rows) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            //If no translations found
            if (rows.length === 0) {
                reject({ status: 404, message: 'No translations found' });
                return;
            };
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
                reject({ status: 500, message: err.message });
                return;
            };
            //If not found
            if (!row) {
                reject({ status: 404, message: 'Word not found' });
                return;
            };
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
                reject({ status: 500, message: err.message });
                return;
            };
            //If not found
            if (!row) {
                reject({ status: 404, message: 'Tanslations not found' });
                return;
            };
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
                reject({ status: 500, message: err.message });
                return;
            };
            if (rows.length === 0) {
                reject({ status: 404, message: 'Translations not found' });
                return;
            };
            resolve(rows);
        });
    });
};

const postWords = async (langId, word) => {
    return new Promise(async (resolve, reject) => {
        //Will refuse if the word is empty. Will also be handled in frontend for redundancy
        try {
            if (word.length < 1) {
                reject({ status: 400, message: 'Word cannot be empty' });
            }
            await getLanguageById(langId);
            db.run('INSERT INTO words (lang_id, word) VALUES (?, ?)', [langId, word], function (err) {
                if (err) {
                    //Unique constraint error
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        reject({ status: 409, message: 'Word already exists' });
                        return;
                    };
                    reject({ status: 500, message: err.message });
                    return;
                }
                //Resolve and show the data
                resolve({ id: this.lastID, lang_id: langId, word: word });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const postTranslations = (id, transId) => {
    return new Promise((resolve, reject) => {
        //Reject if any value is empty
        if (!id || !transId) {
            reject({ status: 400, message: 'Values cannot be empty' });
            return;
        };
        //Check if the word id exists
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, wordRow) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            if (!wordRow) {
                reject({ status: 404, message: 'Word not found' });
                return;
            };
            //See if word transID exists
            db.get('SELECT * FROM words WHERE id = ?', [transId], (err, transRow) => {
                if (err) {
                    reject({ status: 500, message: err.message });
                    return;
                };
                if (!transRow) {
                    reject({ status: 404, message: 'Translation word not found' });
                    return;
                };
                //Block if both words are in the same language
                if (wordRow.lang_id === transRow.lang_id) {
                    reject({ status: 400, message: 'Words in the same language cannot be linked as translations' });
                    return;
                };
                //Add the translation
                db.run('INSERT INTO translations (word_id, trans_id) VALUES (?, ?)', [id, transId], function (err) {
                    if (err) {
                        if (err.message.includes('UNIQUE')) {
                            reject({ status: 409, message: 'Translation already exists' });
                            return;
                        }
                        reject({ status: 500, message: err.message });
                        return;
                    };
                    /*Add the translation other way around. This was harder to figure out with
                    comma separation hence the change.*/
                    db.run('INSERT INTO translations (word_id, trans_id) VALUES (?, ?)', [transId, id], function (err) {
                        if (err) {
                            if (err.message.includes('UNIQUE')) {
                                reject({ status: 409, message: 'Reverse translation already exists' });
                                return;
                            };
                            reject({ status: 500, message: err.message });
                            return;
                        };
                        resolve({ id: this.lastID, wordId: id, transId: transId });
                    });
                });
            });
        });
    });
};

const deleteWord = async (id) => {
    //Reuse the async promise to get it to work
    return new Promise(async (resolve, reject) => {
        try {
            //Ensure the word exists
            await getWordsById(id);
            db.run('DELETE FROM words WHERE id = ?', [id], function (err) {
                if (err) {
                    reject({ status: 500, message: err.message });
                    return;
                };
                //Delete any translation related to the word
                db.run('DELETE FROM translations WHERE word_id = ? OR trans_id = ?', [id, id], function (err) {
                    if (err) {
                        reject({ status: 500, message: err.message });
                        return;
                    };
                    resolve();
                });
            });
            //Catch getwordsbyid error
        } catch (error) {
            reject(error);
        };
    });
};

const deleteTranslation = (id, transId) => {
    return new Promise((resolve, reject) => {
        //Check if the translation exists first before executing
        db.get('SELECT * FROM translations WHERE word_id = ? AND trans_id = ?', [id, transId], (err, row) => {
            if (err) {
                reject({ status: 500, message: err.message });
                return;
            };
            if (!row) {
                reject({ status: 404, message: 'Translation not found' });
                return;
            };
            //Delete the initial translation
            db.run('DELETE FROM translations WHERE word_id = ? AND trans_id = ?', [id, transId], function (err) {
                if (err) {
                    reject({ status: 500, message: err.message });
                    return;
                };
                //And the ol' switcheroo
                db.run('DELETE FROM translations WHERE word_id = ? AND trans_id = ?', [transId, id], function (err) {
                    if (err) {
                        reject({ status: 500, message: err.message });
                        return;
                    };
                    resolve();
                });
            });
        });
    });
};

const editWord = async (id, newWord) => {
    /*This was suggested by chatGPT. Turns out, you can make promises asynchronous as well!
    This wouldn't work without setting the whole function and the promise as asynchronous. I was stumped when
    the await wouldn't work inside the promise at first. GPT suggested to make the promise asynchronous*/
    return new Promise(async (resolve, reject) => {
        try {
            /*Use the get wordsid function before to ensure it exists.*/
            await getWordsById(id);
            //update the word
            db.run('UPDATE words SET word = ? WHERE id = ?', [newWord, id], function (err) {
                if (err) {
                    reject({ status: 500, message: err.message });
                    return;
                };
                resolve();
            });
            //Catch error with getWordsById
        } catch (error) {
            reject({ status: 404, message: 'Edited word not found. Double check the ID' });
        };
    });
};




/*Note to self: Right now, you got most of the main shit nailed down.
If any other needs arises, you can come back and then make more functions for that specific task.
Do the edit functions and you should be golden to start nailing down the frontend*/

/*Something to wonder here, do I really need a function to edit translations other than just words?
Translation swapping can easily be just handled with deletion and re-adding a new one. Plus, words
can have multiple translations, so it feels unnecessary anyways. Translations table is just there
to link related words toghter and doesn't necessarily need an edit function*/

/*Oh and right, make a schema for words and go over the error handling still */
//Export all the modules for the router.js
module.exports = {
    getAllLanguages,
    getAllWords,
    getAllTranslations,
    getWordsById,
    getLanguageById,
    getTranslationsById, //This might be an useless function
    getTranslationsByWordId,
    postWords,
    postTranslations,
    deleteWord,
    deleteTranslation,
    editWord,
};
