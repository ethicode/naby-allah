import React, { useState, useEffect } from 'react';
import {
    List,
    ListItemText,
    IconButton,
    ListItemButton,
    Box,
    Paper,
    CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import BottomPlayer from './bottomPlayer';

const GoogleDriveFileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [loadingAudioId, setLoadingAudioId] = useState(null);

    const apiKey = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I';
    const { folderId } = useParams();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType)&key=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error('Problème de récupération des fichiers.');
                }

                const data = await response.json();

                // 🎯 Ne garder que les fichiers audio
                const audioFiles = data.files.filter(file =>
                    file.mimeType.startsWith('audio/')
                );

                if (audioFiles.length === 0) {
                    setError('Aucun fichier audio trouvé.');
                } else {
                    setFiles(audioFiles);
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
        newAudio.preload = 'auto';

        newAudio.addEventListener('canplaythrough', () => {
            setLoadingAudioId(null);
        });

        setLoadingAudioId(fileId);
        newAudio.play();

        setAudio(newAudio);
        setPlayingId(fileId);
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, padding: 1, marginX: 6, marginBottom: 20 }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List>
                {files.map((file) => (
                    <ListItemButton
                        key={file.id}
                        onClick={() => handlePlayAudio(file.id)}
                        sx={{
                            backgroundColor: playingId === file.id ? 'teal' : 'transparent',
                            color: playingId === file.id ? 'white' : 'inherit',
                            '&:hover': {
                                backgroundColor: playingId === file.id ? 'teal' : 'action.hover',
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
