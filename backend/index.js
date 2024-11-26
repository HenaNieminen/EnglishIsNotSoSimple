const express = require("express");
const Router = require("./routes/router.js");
const port = process.env.PORT || 3000;
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/locations", Router);

app.listen(port, () => {
    console.log(`Activating RESTful at: ${port}`);
});
