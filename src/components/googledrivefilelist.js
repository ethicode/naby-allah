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

    const handlePlayAudio = async (fileId) => {
        try {
            // Si un audio est déjà en cours, on l'arrête
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Impossible de récupérer l'audio");

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            const newAudio = new Audio(audioUrl);
            setAudio(newAudio);

            await newAudio.play(); // ⬅️ On lance la lecture ici
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div>
            <h1>Liste des fichiers du dossier </h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List>
                {files.map((file) => (
                    <ListItem key={file.id}>
                        <ListItemButton primary={file.name} >
                            <ListItemText primary={file.name} />
                            {file.mimeType && file.mimeType.includes("audio") && (
                                <IconButton onClick={() => handlePlayAudio(file.id)}>
                                    <PlayArrowIcon />
                                </IconButton>
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <BottomPlayer audio={audio} setAudio={setAudio} />
        </div>
    );
};

export default GoogleDriveFileList;
