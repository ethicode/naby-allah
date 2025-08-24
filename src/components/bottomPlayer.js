import React, { useState, useEffect } from 'react';
import {
  BottomNavigation,
  Box,
  Fab,
  IconButton,
  Paper,
  Typography,
  Slider,
  Stack,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import LoopIcon from '@mui/icons-material/Loop';
import RestoreIcon from '@mui/icons-material/Restore';
import VolumeMute from '@mui/icons-material/VolumeMute';  // <-- Ajoutez cette ligne
export default function BottomPlayer({ audio, setAudio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume par défaut à 100%
  const [isMuted, setIsMuted] = useState(false); // État pour la gestion du muet
  const [currentTime, setCurrentTime] = useState(0); // Temps actuel de l'audio
  const [duration, setDuration] = useState(0); // Durée totale de l'audio
  const [isLooping, setIsLooping] = useState(false);

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

  const handleChange = (event, newValue) => {
    if (audio && duration && !isNaN(duration)) {
      const newTime = (newValue / 100) * duration;
      if (isFinite(newTime) && newTime >= 0 && newTime <= duration) {
        audio.currentTime = newTime;
      }
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100); // Convertir la valeur du slider en un pourcentage (0 à 1)
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleLoop = () => {
    if (audio) {
      audio.loop = !audio.loop;
      setIsLooping(audio.loop);
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderRadius: 3 }} elevation={6}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, py: 1 }}>
        {/* Loop Button */}
        <Fab
          onClick={toggleLoop}
          disabled={!audio}
          sx={{
            backgroundColor: isLooping ? 'teal' : '#f5f5f5',
            color: isLooping ? 'white' : 'black',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: isLooping ? '#004d40' : '#e0e0e0',
            },
          }}
        >
          <LoopIcon />
        </Fab>

        {/* Stop Button */}
        <Fab
          onClick={handleStop}
          disabled={!audio}
          sx={{
            backgroundColor: '#f5f5f5',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <StopIcon />
        </Fab>

        {/* Play/Pause Button */}
        <Fab
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={!audio}
          sx={{
            backgroundColor: isPlaying ? 'teal' : '#f5f5f5',
            color: isPlaying ? 'white' : 'black',
            width: 50,
            height: 50,
            '&:hover': {
              backgroundColor: isPlaying ? '#004d40' : '#e0e0e0',
            },
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Fab>
      </Box>

      {/* Progress Slider */}
      <Stack spacing={2} direction="row" sx={{ paddingX: 2, alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTime(currentTime)}
        </Typography>
        <Slider
          aria-label="Progression"
          value={(currentTime / duration) * 100}
          onChange={handleChange}
          sx={{ width: '100%' }}
        />
        <Typography variant="body2" color="text.secondary">
          {formatTime(duration)}
        </Typography>
      </Stack>
    </Paper>
  );
}
