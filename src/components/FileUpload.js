import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'

const FileUpload = ({ files, setFiles, removeFile, onFileUploadNotifyDatasets }) => {
  const uploadHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    file.isUploading = true;

    // read file and send contents to datasets page
    var reader = new FileReader();
    reader.onload = function(event) {
      onFileUploadNotifyDatasets(event.target.result);
    };
    reader.readAsText(file);

    setFiles([...files, file])

    file.isUploading = false;

    // upload file
    // const formData = new FormData();
    // formData.append(
    //   "newFile",
    //   file,
    //   file.name
    // )
    // const config = {
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    // }
    // axios.post('http://localhost:8080/upload', formData, config)
    //   .then((res) => {
    //     file.isUploading = false;
    //     //setFiles([...files, file])
    //   })
    //   .catch((err) => {
    //     // inform the user
    //     console.error(err)
    //     removeFile(file.name)
    //   });
  }

  return (
    <>
      <div className="file-card">

        <div className="file-inputs">
          <input type="file" onChange={uploadHandler} />
          <button>
            <i>
              <FontAwesomeIcon icon={faPlus} />
            </i>
            Upload Dataset
          </button>
        </div>

        <p className="main">Supported files</p>
        <p className="info">TXT, CSV</p>

      </div>
    </>
  )
}

export default FileUpload
