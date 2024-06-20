# PDF Text Extractor

Simple MERN webapp to extract text from an uploaded PDF using OCR. 

## Technologies

- React for the frontend
- Express for the backend
- Multer for handling file uploads
- pdfjs-dist and pdf-parse for PDF parsing
- Tesseract.js for OCR

**NOTE:** If the text data is embedded directly in the PDF (the PDF contains searchable text), `pdf-parse` is used directly to extract the text. If the text data is not directly embedded (the PDF contains scanned images or non-searchable text), each page is converted to an image using `pdf.js` and then sent to `Tesseract.js` for OCR.

## Setup Instructions

### Installation

1. Clone the repository:
   ```bash
   https://github.com/antoinekllee/pdf-ocr.git
   cd pdf-ocr
   ```

2. Install dependencies for the frontend:
   ```bash
   cd client
   npm install
   ```

3. Install dependencies for the backend:
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.