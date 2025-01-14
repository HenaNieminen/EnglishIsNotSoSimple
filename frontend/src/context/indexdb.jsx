import { openDB } from 'idb';

const db = 'simple_db'

//Open up the indexedDB
export const initIndexDB = async () => {
    const db = await openDB(db, 1, {
        upgrade(db) {
            //Keypath is similar to how primary keys work in SQL. No schema is required as well
            db.createObjectStore('words', { keyPath: 'id'});
            db.createObjectStore('translations', { keyPath: 'id'});
        },
    });
    return db
};