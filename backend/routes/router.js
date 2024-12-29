const sqlite = require("../database/functions.js");
const express = require("express");
const router = express.Router();
router.use(express.json());

// Languages table routes

router.get("/languages", async (req, res) => {
    try {
        const data = await sqlite.getAllLanguages();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.get("/languages/:id([0-9]+)", async (req, res) => {
    //Fetch an specific word by ID from the words table
    try {
        const data = await sqlite.getLanguageById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

// End of languages table routes

//Words table routes

router.get("/words", async (req, res) => {
    //Fetch all information from wordpairs table using the getWordPairs function
    try {
        const data = await sqlite.getAllWords();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.get("/words/:id([0-9]+)", async (req, res) => {
    //Fetch an specific word by ID from the words table
    try {
        const data = await sqlite.getWordsById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.post("/words", async (req, res) => {
    //Post words into the words table
    try {
        const { langId, word } = req.body;
        if (!word) {
            throw { status: 400, message: "Word is required" };
        } else if (!langId) {
            throw { status: 400, message: "Language ID is required" };
        }
        const data = await sqlite.postWords(langId, word);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error adding to database", error);
        res.status(error.status).json(error.message);
    }
});

router.patch("/words", async (req, res) => {
    try {
        const { id, word } = req.body;
        if (!word) {
            throw { status: 400, message: "Word is required" };
        }
        const data = await sqlite.editWord(id, word);
        res.status(201).json("Word updated succesfully!");
    } catch (error) {
        console.error("Error editing database", error);
        res.status(error.status).json(error.message);
    }
});

//End of words table routes

//Translations table routes

router.get("/translations", async (req, res) => {
    //Get all translations from the translations table
    try {
        const data = await sqlite.getAllTranslations();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.get("/translations/:id([0-9]+)", async (req, res) => {
    //Get an specific translation by ID (Translation id not word ID)
    try {
        const data = await sqlite.getTranslationsById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
    /*I will also need a version where you can fetch it by word ID. This
    is pretty useless for the frontend handling, but I made it anyway*/
});

router.get("/translationsforword/:id([0-9]+)", async (req, res) => {
    //Get an specific translation by word ID
    try {
        const data = await sqlite.getTranslationsByWordId(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching from database", error);
        res.status(error.status).json(error.message);
    }
});

router.delete("/translations/:wordId([0-9]+)&:transId([0-9]+)", async (req, res) => {
    try {
        await sqlite.deleteTranslation(req.params.wordId, req.params.transId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting from database", error);
        res.status(error.status).json(error.message);
    }
});

//End of translation table routes

//Mixed Table routes

router.post("/translations", async (req, res) => {
    //Post translations to the translations table
    try {
        const { id, transId } = req.body;
        const data = await sqlite.postTranslations(id, transId);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error adding to database", error);
        res.status(error.status).json(error.message);
    }
});

router.delete("/words/:id([0-9]+)", async (req, res) => {
    try {
        await sqlite.deleteWord(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting from database", error);
        res.status(error.status).json(error.message);
    }
});

//End of mixed table routes

module.exports = router;
