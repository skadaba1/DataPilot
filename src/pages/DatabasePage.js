import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import './DatabasePage.css';

function DatabasePage() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  return (
    <div className="databases-container">
      <h1 className="databases-title">Databases</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {uploadedFile && (
        <div className="uploaded-file">
          Uploaded File: {uploadedFile.name}
        </div>
      )}
    </div>
  );
}

export default DatabasePage;
