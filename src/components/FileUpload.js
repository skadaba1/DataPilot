import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-input" className="upload-button">
        Upload Database
      </label>
      <input
        type="file"
        id="file-input"
        accept=".csv, .xlsx, .json" // Specify accepted file types
        onChange={handleFileChange}
      />
      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
