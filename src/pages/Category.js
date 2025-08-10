import React, { useEffect, useState } from 'react';
import GoogleDriveFileList from '../components/googledrivefilelist';


function Category({ files, onSelect }) {
  

  return (
    <div className="file-list">
      <GoogleDriveFileList />
    </div>
  );
}

export default Category;




