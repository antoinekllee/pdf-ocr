import express from "express";

import multer from "multer";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfParse from "pdf-parse";

import { createCanvas } from "canvas";
import Tesseract from "tesseract.js";

const app = express();
const port = 3001;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to convert PDF page to image
const pdfPageToImage = async (pdfPage) => {
    const viewport = pdfPage.getViewport({ scale: 2 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await pdfPage.render(renderContext).promise;

    return canvas.toDataURL();
};

// Function to perform OCR on an image
const ocrImage = async (imageData) => {
    const {
        data: { text },
    } = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m),
    });
    return text;
};

// Handle file upload and PDF text extraction
app.post("/api/upload", upload.single("pdfFile"), async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const data = await pdfParse(pdfBuffer);

        if (data.text.replace(/\n/g, " ") === "") {
            return res.json({ text: data.text });
        }

        const pdfBytes = new Uint8Array(req.file.buffer);
        const loadingTask = getDocument({ data: pdfBytes });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        let combinedText = "";

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const imageData = await pdfPageToImage(page);
            const pageText = await ocrImage(imageData);
            combinedText += pageText + "\n";
        }

        res.json({ text: combinedText });
    } catch (error) {
        console.error("Error during PDF text extraction:", error);
        res.status(500).json({ error: "Failed to extract text from PDF" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
