import React from 'react';

function FileList({ files, onSelect }) {
  return (
    <div className="file-list">
      <h2>Liste des fichiers audio</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} onClick={() => onSelect(file)}>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
