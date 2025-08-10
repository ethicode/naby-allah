import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, ListItemButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from 'react-router-dom';
import BottomPlayer from './bottomPlayer';

const GoogleDriveFileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null); // Ajout d'un état pour l'audio
    const apiKey = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I'; // Remplace par ta clé API
    //   const folderId = '1nAX4HBP_sJPTxMbgZTaZL8gV-0zlb_jW'; // Remplace par l'ID de ton dossier

    const { folderId } = useParams();
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
                console.log(data.files);
                if (data.files) {
                    setFiles(data.files);
                } else {
                    setError('Aucun fichier trouvé.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFiles();
    }, []);

    const handlePlayAudio = (fileId) => {
    try {
        // Arrêter l'audio précédent
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Lien direct de streaming Google Drive
        const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

        // Créer un objet Audio qui lit directement depuis l'URL
        const newAudio = new Audio(fileUrl);
        newAudio.loop = true; // 🔁
        newAudio.play();

        setAudio(newAudio);
    } catch (err) {
        setError(err.message);
    }
};



    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List sx={{ width: '100%', maxWidth: 360}}>
                {files.map((file) => (
                    <ListItemButton key={file.id} color="primary" primary={file.name} onClick={() => handlePlayAudio(file.id)}>
                        <ListItemText primary={file.name} />
                        {file.mimeType && file.mimeType.includes("audio") && (
                            <IconButton>
                                <PlayArrowIcon />
                            </IconButton>
                        )}
                    </ListItemButton>
                ))}
            </List>
            <BottomPlayer audio={audio} setAudio={setAudio} />
        </div>
    );
};

export default GoogleDriveFileList;
