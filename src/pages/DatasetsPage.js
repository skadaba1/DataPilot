import { useState } from 'react'
import './DatabasePage.css';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

function DatasetsPage({ onFileUploadNotifyApp }) {
  const [files, setFiles] = useState([])

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename));
  }

  const handleFileUploadDatasets = (newDataContent) => {
    onFileUploadNotifyApp(newDataContent);
  }

  return (
    <div class="flex flex-col items-center">
      <h1>external data</h1>
      <div className='header_underline'></div>
      <div className="flex flex-row space-x-4 items-start">
        <div className="datasets-container">
          <FileUpload files={files} setFiles={setFiles}
            removeFile={removeFile} onFileUploadNotifyDatasets={handleFileUploadDatasets} />
        </div>
        <div className="datasets-container">
          <FileUpload files={files} setFiles={setFiles}
            removeFile={removeFile} onFileUploadNotifyDatasets={handleFileUploadDatasets} />
        </div>
      </div>
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
}

export default DatasetsPage;
