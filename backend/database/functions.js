const db = require("./database.js");
//Import the database

const getAllWords = () => {
    return new Promise((resolve, reject) => {
        /*Query all the wordpairs from the table*/
        db.all('SELECT * FROM wordpairs', (err, rows) => {
            if (err) {
                //Throw error with reject (Will need better error handling in the future
                return reject(err);
            }
            //Resolve returns all taken data
            resolve(rows);
        });
    });
};

//Export all the modules for the router.js
module.exports = {
    getAllWords
};
