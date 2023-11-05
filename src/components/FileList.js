import axios from 'axios'
import React, {useEffect} from 'react'
import FileItem from './FileItem'

let filesPersistent = [];

const FileList = ({ files, removeFile }) => {
    useEffect(() => {
        files.forEach((file, index) => {
            if (file && !filesPersistent.includes(file)) {
                filesPersistent = [file, ...filesPersistent];
            }   
        });
    }, [files]);

    const deleteFileHandler = (_name) => {
        axios.delete(`http://localhost:8080/upload?name=${_name}`)
            .then((res) => removeFile(_name))
            .catch((err) => console.error(err));
    }
    return (
        <ul className="file-list">
            {
                filesPersistent &&
                filesPersistent.map(f => (<FileItem
                    key={f.name}
                    file={f}
                    deleteFile={deleteFileHandler} />))
            }
        </ul>
    )
}

export default FileList