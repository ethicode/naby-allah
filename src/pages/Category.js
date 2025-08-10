import React, { useEffect, useState } from 'react';
import GoogleDriveFileList from '../components/googledrivefilelist';


function Category({ files, onSelect }) {
  

  return (
    <div >
      <GoogleDriveFileList />
    </div>
  );
}

export default Category;




