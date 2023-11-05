import { useState } from 'react'
import './DatabasePage.css';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

function DatasetsPage({onFileUploadNotifyApp}) {
  const [files, setFiles] = useState([])

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename));
  }

  const handleFileUploadDatasets = (newDataContent) => {
    onFileUploadNotifyApp(newDataContent);
  }

  return (
    <div className="datasets-container">
      <FileUpload files={files} setFiles={setFiles}
        removeFile={removeFile} onFileUploadNotifyDatasets = {handleFileUploadDatasets} />
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
}

export default DatasetsPage;
