const db = require("./database.js");
//Import the database

const getAllWords = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM words', (err, rows) => {
            if (err) {
                return reject({ status: 500, message: err.message });
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
            resolve(rows);
        });
    });
};

const getWordsById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!row) {
                return reject({ status: 404, message: 'Word not found' });
            }
            resolve(row);
        });
    });
};

const getTranslationsById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM words WHERE id = ?', [id], (err, row) => {
            if (err) {
                return reject({ status: 500, message: err.message });
            }
            if (!row) {
                return reject({ status: 404, message: 'Tanslations not found' });
            }
            resolve(row);
        });
    });
};


//Export all the modules for the router.js
module.exports = {
    getAllWords,
    getAllTranslations,
    getWordsById,
    getTranslationsById,
};
