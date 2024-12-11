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
    }
});



module.exports = router;