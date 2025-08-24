import React, { useState, useEffect } from 'react';
import {
  List,
  ListItemText,
  IconButton,
  ListItemButton,
  Box,
  Paper,
  CircularProgress,
  Drawer,
  Avatar,
  Typography,
  Slider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { PlayArrow, Pause, SkipNext, SkipPrevious, VolumeUp, ArrowBack } from '@mui/icons-material';
import BottomPlayer from './bottomPlayer';

const GoogleDriveFileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [loadingAudioId, setLoadingAudioId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [imageFile, setImageFile] = useState(null); // Stocke l'image trouvée dans le dossier

  const apiKey = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I';
  const { folderId } = useParams();

  // Recherche les fichiers audio et image dans le dossier
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
        const mediaFiles = data.files.sort((a, b) => a.name.localeCompare(b.name));

        // Recherche une image dans les fichiers
        const imageFile = mediaFiles.find(file => file.mimeType.startsWith('image/'));

        setFiles(mediaFiles.filter(file => file.mimeType.startsWith('audio/'))); // Seuls les fichiers audio
        setImageFile(imageFile || null); // Si une image existe, la stocker

        if (mediaFiles.length === 0) {
          setError('Aucun fichier trouvé.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, [folderId]);

  const handlePlayAudio = (fileId, file) => {
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

    newAudio.addEventListener('timeupdate', () => {
      setAudioProgress((newAudio.currentTime / newAudio.duration) * 100);
    });

    newAudio.play();
    newAudio.volume = volume;

    setLoadingAudioId(fileId);
    setAudio(newAudio);
    setPlayingId(fileId);
    setSelectedFile(file);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    if (audio) {
      audio.pause();
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (audio) {
      audio.currentTime = (newValue / 100) * audio.duration;
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
    if (audio) {
      audio.volume = newValue / 100;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, padding: 2, marginX: 'auto', marginBottom: 20, borderRadius: 2, boxShadow: 3 }}>
      {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}
      <List>
        {files.map((file) => (
          <ListItemButton
            key={file.id}
            onClick={() => handlePlayAudio(file.id, file)}
            sx={{
              backgroundColor: playingId === file.id ? 'rgba(0, 128, 128, 0.1)' : 'transparent',
              borderRadius: 2,
              padding: 1.5,
              marginBottom: 1,
              '&:hover': {
                backgroundColor: playingId === file.id ? 'rgba(0, 128, 128, 0.2)' : 'rgba(0, 0, 0, 0.05)',
              },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                backgroundColor: 'teal',
                marginRight: 2,
                width: 30,
                height: 30,
                fontSize: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlayArrow sx={{ fontSize: '2rem', color: 'white' }} />
            </Avatar>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 100, color: playingId === file.id ? 'teal' : 'inherit' }}>{file.name}</Typography>}
              secondary={<Typography variant="body2" sx={{ color: 'gray' }}>{file.mimeType.split('/')[0]}</Typography>}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '10%' }}>
              {loadingAudioId === file.id ? (
                <CircularProgress size={24} color="primary" />
              ) : playingId === file.id ? (
                <IconButton onClick={() => audio.pause()}>
                  <Pause sx={{ color: 'teal' }} />
                </IconButton>
              ) : (
                <IconButton onClick={() => handlePlayAudio(file.id, file)}>
                  <PlayArrow sx={{ color: 'teal' }} />
                </IconButton>
              )}
            </Box>
          </ListItemButton>
        ))}
      </List>
      <BottomPlayer audio={audio} setAudio={setAudio} />

      <Drawer
  anchor="right"
  open={drawerOpen}
  onClose={handleCloseDrawer}
  sx={{
    width: '100%',
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: '100%',
      boxSizing: 'border-box',
      padding: 2,
      backgroundColor: '#121212',
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', // Change ici pour ajuster la disposition
    },
  }}
>
  {selectedFile && (
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <IconButton onClick={handleCloseDrawer} sx={{ color: 'teal' }}>
          <ArrowBack />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        {imageFile ? (
          <Box
            component="img"
            src={`https://www.googleapis.com/drive/v3/files/${imageFile.id}?alt=media&key=${apiKey}`}
            alt={imageFile.name}
            sx={{
              width: 80,
              height: 80,
              marginRight: 2,
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar sx={{ width: 80, height: 80, backgroundColor: 'teal', marginRight: 2 }}>
            <PlayArrow sx={{ fontSize: '3rem', color: 'white' }} />
          </Avatar>
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'teal' }}>
            {selectedFile.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            {selectedFile.mimeType.split('/')[0]}
          </Typography>
        </Box>
      </Box>
      <Slider
        value={audioProgress}
        onChange={handleSliderChange}
        sx={{
          color: 'teal',
          height: 6,
          '& .MuiSlider-rail': {
            backgroundColor: '#555',
          },
          '& .MuiSlider-track': {
            backgroundColor: 'teal',
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'teal',
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          {formatTime(audio ? audio.currentTime : 0)} / {formatTime(audio ? audio.duration : 0)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: 'teal' }}>
            <SkipPrevious />
          </IconButton>
          <IconButton onClick={() => audio.paused ? audio.play() : audio.pause()} sx={{ color: 'teal' }}>
            {audio?.paused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton sx={{ color: 'teal' }}>
            <SkipNext />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )}

  {/* Déplacement du volume à la fin */}
  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}> {/* Modification ici */}
    <VolumeUp sx={{ color: 'teal', marginRight: 2 }} />
    <Slider
      value={volume * 100}
      onChange={handleVolumeChange}
      sx={{
        color: 'teal',
        height: 6,
        '& .MuiSlider-rail': {
          backgroundColor: '#555',
        },
        '& .MuiSlider-track': {
          backgroundColor: 'teal',
        },
        '& .MuiSlider-thumb': {
          backgroundColor: 'teal',
        },
      }}
    />
  </Box>
</Drawer>

    </Paper>
  );
};

export default GoogleDriveFileList;
