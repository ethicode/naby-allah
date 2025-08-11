import React, { useEffect, useState } from 'react';
import GoogleDriveFileList from '../components/googledrivefilelist';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';


function Category({ files, onSelect }) {
  const location = useLocation();
  const folderName = location.state?.folderName || "Nom inconnu";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 2}}>
      <h1>{folderName}</h1>
      <GoogleDriveFileList />
    </Box>
  );
}

export default Category;




