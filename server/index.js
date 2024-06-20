const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");

const app = express();
const port = 3001;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle file upload and PDF text extraction
app.post("/api/upload", upload.single("pdfFile"), async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const data = await pdfParse(pdfBuffer);
        res.json({ text: data.text });
    } catch (error) {
        res.status(500).json({ error: "Failed to extract text from PDF" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
