import React, { useState } from 'react';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState('');

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setPdfText(result.text);
  };

  return (
    <div className="App">
      <h1>PDF Text Extractor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Extract Text</button>
      <h2>Extracted Text:</h2>
      <pre>{pdfText}</pre>
    </div>
  );
}

export default App;
