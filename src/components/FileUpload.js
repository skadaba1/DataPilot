import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './FileUpload.scss'
import axios from 'axios'

const FileUpload = ({ files, setFiles, removeFile, onFileUploadNotifyDatasets, dataType }) => {
  const uploadHandler = (event) => {
    const file = event.target.files[0];
   
    if (!file) {
      return;
    }
    
    files.forEach((existingFile) => {
      if (file.name == existingFile.name) {
        return;
      }
    });

    file.isUploading = true;

    // send file to datasets page
    onFileUploadNotifyDatasets(file)

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

  const uploadText = "Upload " + dataType;

  return (
    <>
      <div className="file-card">

        <div className="file-inputs">
          <input type="file" onChange={uploadHandler} />
          <button>
            <i>
              <FontAwesomeIcon icon={faPlus} />
            </i>
            {uploadText}
          </button>
        </div>

        <p className="main">Supported files</p>
        <p className="info">TXT, CSV</p>

      </div>
    </>
  )
}

export default FileUpload
