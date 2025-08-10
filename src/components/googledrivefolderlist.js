import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, Grid } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MediaControlCard from './MediaControlCard';
import MediaCard from './MediaCard';

const GoogleDriveFolderList = ({ setAudio }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I'; // Remplace par ta clé API
  const folderId = '1nAX4HBP_sJPTxMbgZTaZL8gV-0zlb_jW'; // Remplace par l'ID de ton dossier

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Problème de récupération des fichiers.');
        }

        const data = await response.json();
        if (data.files) {
          setFiles(data.files);
          console.log(data.files);
        } else {
          setError('Aucun fichier trouvé.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, []);

  const handlePlayAudio = async (fileId) => {
    const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const newAudio = new Audio(audioUrl);
    setAudio(newAudio);
  };

  return (
    <div>
      {/* <MediaControlCard /> */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid size={{ xs: 6, md: 4, lg: 2 }} item key={file.id}>
            <MediaCard name={file.name} id={file.id} />
          </Grid>
        ))}
      </Grid>

    </div>
  );
};

export default GoogleDriveFolderList;
