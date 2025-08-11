import React, { useState, useEffect } from 'react';
import { List, ListItemText, IconButton, ListItemButton, Box, Paper, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from 'react-router-dom';
import BottomPlayer from './bottomPlayer';

const GoogleDriveFileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [loadingAudioId, setLoadingAudioId] = useState(null); // 🔄 Id du fichier en cours de chargement
    const apiKey = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I';

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
    }, [folderId]);

    const handlePlayAudio = (fileId) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const fileUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
        const newAudio = new Audio(fileUrl);
        newAudio.preload = 'auto';  // Préchauffe l'audio pour améliorer le temps de chargement

        // Ajouter un écouteur d'événement pour savoir quand l'audio est prêt
        newAudio.addEventListener('canplaythrough', () => {
            setLoadingAudioId(null); // Audio est prêt, on cache le spinner
        });

        setLoadingAudioId(fileId); // L'audio est en train de se charger, on affiche le spinner
        newAudio.play();

        setAudio(newAudio);
        setPlayingId(fileId); // L'audio commence à jouer
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, padding: 1, marginX: 6, marginBottom: 20 }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List sx={{}}>
                {files.map((file) => (
                    <ListItemButton
                        key={file.id}
                        onClick={() => handlePlayAudio(file.id)}
                        sx={{
                            backgroundColor: playingId === file.id ? 'teal' : 'transparent',
                            color: playingId === file.id ? 'white' : 'inherit',
                            '&:hover': {
                                backgroundColor: playingId === file.id ? 'primary.dark' : 'action.hover',
                            },
                        }}
                    >
                        <ListItemText primary={file.name} />
                        <Box sx={{ display: 'flex' }}>
                            {loadingAudioId === file.id && (
                                <CircularProgress size={24} />
                            )}
                        </Box>
                    </ListItemButton>
                ))}
            </List>
            <BottomPlayer audio={audio} setAudio={setAudio} />
        </Paper>
    );
};

export default GoogleDriveFileList;
