const sqlite = require("../database/functions.js");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/words", async (req, res) => {
    //Fetch all information from wordpairs table using the getWordPairs function
    try {
        const data = await sqlite.getAllWords();
        res.status(200).json(data);
    } catch (error) {
        /*Error handling will need some work to get statuses correct instead of
        stubby non explaining sh**e */
        console.error("Error fetchig from database", error);
        res.status(error.status).json(error.message);
    }
});

router.get("/translations", async (req, res) => {
    try {
        const data = await sqlite.getAllTranslations();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetch from database", error);
        res.status(error.status).json(error.message);
    }
});

router.get("/words/:id([0-9]+)", async (req, res) => {
    try {
        const data = await sqlite.getWordsById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});



module.exports = router;