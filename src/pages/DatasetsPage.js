import { useState } from 'react'
import './DatabasePage.css';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

let allFiles = [];

function DatasetsPage({onFileUploadNotifyApp}) {
  const [files, setFiles] = useState(allFiles)

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename));
  }

  const handleFileUploadDatasets = (newFile) => {
    // for persistence
    allFiles = [newFile, ...allFiles];

    // for filelist
    setFiles(allFiles);

    // read file and send to app page
    var reader = new FileReader();
    reader.onload = function(event) {
      onFileUploadNotifyApp(newFile.name, event.target.result);
    }
    reader.readAsText(newFile)
  }

  return (
    <div class="flex flex-col items-center">
      <h1>external data</h1>
      <div className='header_underline'></div>
      <div className="flex flex-row space-x-4 items-start">
        <div className="datasets-container">
          <FileUpload files={allFiles} setFiles={setFiles}
            removeFile={removeFile} onFileUploadNotifyDatasets={handleFileUploadDatasets}
            dataType = "Dataset" />
        </div>
        <div className="datasets-container">
          <FileUpload files={allFiles} setFiles={setFiles}
            removeFile={removeFile} onFileUploadNotifyDatasets={handleFileUploadDatasets}
            dataType = "Documentation" />
        </div>
      </div>
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
}

export default DatasetsPage;
