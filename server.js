const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/fetchDatabase", async (req, res) => {
    const dbUrl = req.query.url;

    try {
        // Make an API request to the database URL
        const response = await fetch(dbUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
