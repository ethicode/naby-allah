import React, { useState, useEffect } from 'react';
import { List, ListItemText, IconButton, ListItemButton, Box, Paper, CircularProgress, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useParams } from 'react-router-dom';
import BottomPlayer from './bottomPlayer';

const GoogleDriveFileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [audio, setAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [loadingAudioId, setLoadingAudioId] = useState(null); // Id du fichier en cours de chargement
    const [audioProgress, setAudioProgress] = useState(0); // Pour suivre la progression de l'audio
    const [isPlaying, setIsPlaying] = useState(false); // Pour savoir si l'audio est en cours de lecture
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

        newAudio.addEventListener('canplaythrough', () => {
            setLoadingAudioId(null); // Audio est prêt, on cache le spinner
        });

        newAudio.addEventListener('timeupdate', () => {
            setAudioProgress((newAudio.currentTime / newAudio.duration) * 100);
        });

        newAudio.addEventListener('ended', () => {
            setIsPlaying(false);
        });

        setLoadingAudioId(fileId); // L'audio est en train de se charger, on affiche le spinner
        newAudio.play();

        setAudio(newAudio);
        setPlayingId(fileId); // L'audio commence à jouer
        setIsPlaying(true); // L'audio est en cours de lecture
    };

    const handlePauseAudio = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false); // Marquer comme non joué
        }
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, padding: 1, marginX: 6, marginBottom: 20 }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Card qui montre les détails du fichier audio en cours de lecture */}
            {playingId && audio && (
                <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {files.find(file => file.id === playingId)?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                                variant="determinate"
                                value={audioProgress}
                                sx={{ width: '100%', marginY: 1 }}
                            />
                            <Box sx={{ marginLeft: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {Math.floor(audio.currentTime)} / {Math.floor(audio.duration)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={isPlaying ? handlePauseAudio : () => audio.play()}
                            >
                                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />} {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Liste des fichiers */}
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
