const db = require('./database');

const getWordpairs = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM wordpairs', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

module.exports = {
    getWordpairs
};
