const sqlite = require("../database/functions.js");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
    const modifiers = [];
    //If there is a sort query
    if (req.query.sort) {
        modifiers.push(
            //Default is ASC if no direction is given
            `ORDER BY ${req.query.sort} ${req.query.order || "ASC"}`,
        );
    } else if (req.query.latitude) {
        //Filter by latitude
        modifiers.push(`WHERE latitude = ${req.query.latitude}`);
    } else if (req.query.longitude) {
        //Filter by longitude
        modifiers.push(`WHERE longitude = ${req.query.longitude}`);
    }

    sqlite.findAll(modifiers, (error, locations) => {
        if (error) {
            return res.status(error.status || 404).send(error.message);
        }
        res.status(200).send(locations);
    });
});

router.get("/:myId([0-9]+)", (req, res) => {
    const id = parseInt(req.params.myId);
    sqlite.findById(id, (error, location) => {
        if (error) {
            return res.status(404).send(error.message);
        }
        res.status(200).send(location);
    });
});

router.delete("/:myId([0-9]+)", (req, res) => {
    const id = parseInt(req.params.myId);
    sqlite.deleteById(id, (error) => {
        if (error) {
            return res.status(404).send(error.message);
        }
        res.status(204).send();
    });
});

router.post("/", (req, res) => {
    sqlite.save(req.body, (error, location) => {
        if (error) {
            return res.status(400).send(error.message);
        }
        res.status(201).send(location);
    });
});

router.put("/:myId([0-9]+)", (req, res) => {
    const id = parseInt(req.params.myId);
    const location = { id, ...req.body };
    sqlite.put(location, id, (error, updatedLocation) => {
        if (error) {
            return res.status(400).send(error.message);
        }
        res.status(200).send(updatedLocation);
    });
});

router.patch("/:myId([0-9]+)", (req, res) => {
    const id = parseInt(req.params.myId);
    const location = { ...req.body };
    sqlite.patch(location, id, (error, updatedLocation) => {
        if (error) {
            return res.status(400).send(error.message);
        }
        res.status(200).send(updatedLocation);
    });
});

module.exports = router;