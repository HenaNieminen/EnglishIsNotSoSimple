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
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.post("/words", async (req, res) => {
    try {
        const { word } = req.body;
        if (!word) {
            throw { status: 400, message: "Word is required" };
        }
        const data = await sqlite.postWords(word);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error adding to database", error);
        res.status(error.status).json({ message: error.message });
    }
});

router.get("/translations", async (req, res) => {
    try {
        const data = await sqlite.getAllTranslations();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.post("/translations", async (req, res) => {
    try {
        const { id, transIds } = req.body;
        const data = await sqlite.postTranslations(id, transIds);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error adding to database", error);
        res.status(error.status).json({ message: error.message });
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

router.get("/translations/:id([0-9]+)", async (req, res) => {
    try {
        const data = await sqlite.getTranslationsById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});





module.exports = router;