import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import './DatabasePage.css'

function DatabasePage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (file) => {
    setUploadedFiles((prevFiles) => [...prevFiles, file]);
  };

  
  return (
    <div className="databases-container">
      <h1 className="databases-title">Databases</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {uploadedFiles.map((file, index) => (
        <div key={index} className="uploaded-file">
          Uploaded File: {file.name}
        </div>
      ))}
    </div>
  );
}

export default DatabasePage;