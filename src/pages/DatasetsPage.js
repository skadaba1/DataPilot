import { useState } from 'react'
import './DatabasePage.css';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import axios from 'axios';

let allFiles = [];
let documents = "";
let counter = 0;

function DatasetsPage({onFileUploadNotifyApp, id}) {
  const [files, setFiles] = useState(allFiles)

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename));
  }

    // Fetch all Logs
  const handleUpdate = (new_content) => {
      // Send GET request to 'books/one' endpoint
      axios
      .put('http://localhost:4001/logs/update', {
          id: id,
          datasets: new_content, 
      })
      .then(response => {
          // Update the books state
          console.log(JSON.stringify(response));
      })
      .catch(error => console.error(`There was an error updating the logs: ${error}`))
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
      documents = JSON.stringify("DATASET #" + counter + event.target.result);
      console.log("ENTERING UDPATE")
      handleUpdate(documents);
    }
    reader.readAsText(newFile)
    counter = counter + 1;
  }

  const handleButtonClick = () => {
    window.location.href = `/${id}`;
  };

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
      <div>
          <button className="modern-button" onClick={handleButtonClick}>Return to active session</button>
        </div>
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
}

export default DatasetsPage;
