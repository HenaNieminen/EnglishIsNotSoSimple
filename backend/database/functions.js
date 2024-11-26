const joi = require("joi");
const sqlite3 = require("sqlite3").verbose();

//Initialize the Sqlite database in RAM
const db = new sqlite3.Database(":memory:", (error) => {
    if (error) {
        console.error("Error creating database:", error);
    } else {
        console.log("SQLite successful.");
        /*Serialize and run it so that the create statement doesn't run in parrarel
        with the insert statements*/
        db.serialize(() => {
            db.run(
                `CREATE TABLE locations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    latitude FLOAT(10, 6) NOT NULL,
                    longitude FLOAT(10, 6) NOT NULL
                )`,
                (error) => {
                    if (error) {
                        console.error("Error creating table:", error);
                    } else {
                        console.log("Table created.");
                    }
                }
            );
            //Post some template data
            db.run(
                `INSERT INTO locations (latitude, longitude) VALUES (13.1545, 14.656),
                (55.75167, 37.61778), (61.50369, 23.80850),
                (48.06758, 12.86196), (60.60529, 27.38521),
                (53.58809, -0.65507), (34.20733, -84.14022),
                (27.83455, 112.52018)`,
                (error) => {
                    if (error) {
                        console.error("Error inserting placeholder", error);
                    }
                }
            );
        });
    }
});

// Schema for post requests
const locationSchema = joi.object({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
});

// Schema for patch requests
const updateSchema = joi
    .object({
        latitude: joi.number().min(-90).max(90),
        longitude: joi.number().min(-180).max(180),
    })
    .min(1);

// Schema for put requests
const putSchema = joi.object({
    id: joi.number().required(),
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
});

// Find all locations
const findAll = (modifiers, callback) => {
    let query = `SELECT * FROM locations`;

    if (modifiers.length > 0) {
        query += ` ${modifiers.join(" ")}`;
    }
    //Converted to sqlite
    db.all(query, [], function (err, rows) {
        if (err) {
            callback({
                status: 400,
                message: "Incorrect query syntax",
            });
            /*Errors and callbacks will need some work. It is now
            a mishmash of setting statuses and messages and then throwing errors*/
        } else if (rows.length === 0) {
            callback(new Error("No locations found on the database"));
        } else {
            callback(null, rows);
        }
    });
};

// Find by specific id
const findById = (id, callback) => {
    const query = `SELECT * FROM locations WHERE id = ?`;

    db.get(query, [id], function (err, row) {
        if (err) {
            callback(new Error("Incorrect query syntax"));
        } else if (!row) {
            callback(new Error("Location not found"));
        } else {
            callback(null, row);
        }
    });
};

//Delete by specific id
const deleteById = (id, callback) => {
    const query = `DELETE FROM locations WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            callback(new Error("Incorrect query syntax"));
        } else if (this.changes === 0) {
            callback(new Error("Location not found"));
        } else {
            callback(null);
        }
    });
};

// Post a new location
const save = (location, callback) => {
    const { error } = locationSchema.validate(location);

    if (error) {
        callback(new Error("Invalid location data given"));
        return;
    }

    const query = `INSERT INTO locations (latitude, longitude) VALUES (?, ?)`;

    db.run(query, [location.latitude, location.longitude], function (err) {
        if (err) {
            callback(new Error("Incorrect query syntax"));
        } else {
            callback(null, { id: this.lastID, ...location });
        }
    });
};

const put = (location, id, callback) => {
    const { error } = putSchema.validate(location);
    if (error) {
        callback(new Error("Invalid location data given"));
        return;
    }

    const query = `
        INSERT INTO locations (id, latitude, longitude)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            latitude = excluded.latitude,
            longitude = excluded.longitude
    `;
    //A bit different syntax from MariaDB. Instead of on duplicate, you use on conflict
    db.run(
        query,
        [id, location.latitude, location.longitude], function (err) {
            if (err) {
                callback(new Error("Incorrect query syntax"));
            } else {
                callback(null, { id, ...location });
            }
        }
    );
};

const patch = (location, id, callback) => {
    const { error } = updateSchema.validate(location);
    if (error) {
        callback(new Error("Invalid location data given"));
        return;
    }

    // Create an array of updates to the query so one of them can be undefined
    const updates = [];
    if (location.latitude !== undefined) {
        updates.push(`latitude = ${(location.latitude)}`);
    }
    if (location.longitude !== undefined) {
        updates.push(`longitude = ${(location.longitude)}`);
    }

    if (updates.length === 0) {
        callback(
            new Error(
                "No valid updates given. Please provide at least latitude or longitude",
            ),
        );
        return;
    }
    // Create the query string with the updates
    const query = `UPDATE locations SET ${updates.join(", ")} WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            callback(new Error("Incorrect query syntax"));
        } else if (this.changes === 0) {
            callback(new Error("Location not found"));
        } else {
            callback(null, { id, ...location });
        }
    });
};

// Export the database functions for use in other files
module.exports = {
    findAll,
    findById,
    deleteById,
    save,
    put,
    patch,
};
