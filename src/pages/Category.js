import React, { useEffect, useState } from 'react';
import GoogleDriveFileList from '../components/googledrivefilelist';


function Category({ files, onSelect }) {
  

  return (
    <div >
            <h1>Liste des fichiers </h1>
      <GoogleDriveFileList />
    </div>
  );
}

export default Category;




