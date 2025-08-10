import React, { useState, useEffect } from 'react';

function AudioPlayer({ file }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // Recharger la source audio à chaque changement de fichier
    }
  }, [file]);

  return (
    <div className="audio-player">
      <h3>Lecture de: {file.name}</h3>
      <audio ref={audioRef} controls>
        <source src={file.url} type="audio/mpeg" />
        Votre navigateur ne supporte pas l'élément audio.
      </audio>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

export default AudioPlayer;
