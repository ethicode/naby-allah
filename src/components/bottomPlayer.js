import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Fab, IconButton, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { Loop, LoopTwoTone, VolumeMute } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';

export default function BottomPlayer({ audio, setAudio }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Volume par défaut à 100%
    const [isMuted, setIsMuted] = useState(false); // État pour la gestion du muet
    const [currentTime, setCurrentTime] = useState(0); // Temps actuel de l'audio
    const [duration, setDuration] = useState(0); // Durée totale de l'audio

    // Si un nouvel audio est reçu, on le lance directement
    useEffect(() => {
        if (audio) {
            const onLoadedMetadata = () => {
                setDuration(audio.duration); // Assigner la durée une fois que les métadonnées sont disponibles
            };
            // Écouter l'événement 'loadedmetadata' pour être sûr que la durée est définie
            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.play();
            setIsPlaying(true);
            const timeUpdateInterval = setInterval(() => {
                setCurrentTime(audio.currentTime);
            }, 100); // Met à jour chaque seconde
            audio.volume = volume;
            audio.muted = isMuted;
            // Gérer la fin de la lecture de l'audio
            audio.onended = () => {
                setIsPlaying(false);
            };
            return () => clearInterval(timeUpdateInterval);
        }
    }, [audio]);

    const handlePlay = () => {
        if (audio) {
            audio.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const handleStop = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        }
    };
    const [value, setValue] = React.useState(30);

    const handleChange = (event, newValue) => {
        if (audio && duration && !isNaN(duration)) {
            // Convertir la valeur du Slider (0-100) à la position réelle dans la durée de l'audio
            const newTime = (newValue / 100) * duration;

            // S'assurer que la nouvelle position est valide et dans les limites
            if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
                audio.currentTime = newTime;
            }
        }
    };

    // Fonction pour gérer le changement du volume
    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue / 100); // Convertir la valeur du slider en un pourcentage (0 à 1)
    };

    // Fonction pour activer/désactiver le muet
    const handleMuteToggle = () => {
        setIsMuted((prev) => !prev);
    };

    // Fonction pour formater un temps en H:MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const [isLooping, setIsLooping] = useState(false);

    const toggleLoop = () => {
        if (audio) {
            audio.loop = !audio.loop;
            setIsLooping(audio.loop);
        }
    };


    return (
        <>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        py: 1
                    }}
                >
                    {/* Stop */}
                    {/* <IconButton
                        color={isLooping ? 'secondary' : 'primary'}
                        onClick={toggleLoop}
                        disabled={!audio}
                        sx={{
                            bgcolor: '#f5f5f5',
                            '&:hover': { bgcolor: '#e0e0e0' }
                        }}
                    >
                        {isLooping ? <Loop /> : <Loop />}

                    </IconButton> */}
                    <Fab
                        onClick={toggleLoop}
                        disabled={!audio}
                        sx={{
                            backgroundColor: isLooping ? 'teal' : '',
                            color: isLooping? 'white': 'black' ,
                            width: 40,
                            height: 40
                        }}
                    >
                        {isLooping ? <Loop /> : <Loop />}
                    </Fab>
                    <Fab
                        onClick={handleStop}
                        disabled={!audio}
                        // color={isPlaying ? 'secondary' : 'primary'}
                        sx={{
                            width: 40,
                            height: 40
                        }}
                    >
                        <StopIcon />
                    </Fab>

                    {/* Play/Pause */}
                    <Fab
                        onClick={isPlaying ? handlePause : handlePlay}
                        disabled={!audio}
                        // color={isPlaying ? 'secondary' : 'primary'}
                        sx={{
                            backgroundColor: isPlaying ? 'teal' : '',
                            color: isPlaying? 'white': 'black' ,
                            width: 40,
                            height: 40
                        }}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </Fab>

                    {/* Volume */}
                </Box>

                <Stack spacing={2} direction="row" sx={{ paddingX: 2, alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {formatTime(currentTime)}
                    </Typography>
                    <Slider
                        aria-label="Progression"
                        value={(currentTime / duration) * 100}
                        onChange={handleChange}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {formatTime(duration)}
                    </Typography>
                </Stack>
            </Paper>
        </>
    );
}
