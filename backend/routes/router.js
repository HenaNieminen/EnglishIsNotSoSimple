const sqlite = require("../database/functions.js");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/wordpairs", async (req, res) => {
    try {
        const data = await sqlite.getWordpairs();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetchig from database", error);
    }
});



module.exports = router;