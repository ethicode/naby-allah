import { useState, useEffect } from 'react';
import { fetchFilesFromDrive } from '../services/googleDriveService';

function useFiles() {
  const [files, setFiles] = useState([]); // Assurez-vous que files est un tableau vide au départ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getFiles() {
      try {
        const filesData = await fetchFilesFromDrive();
        setFiles(filesData || []); // Si filesData est undefined, on initialise files à un tableau vide
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    getFiles();
  }, []);

  return { files, loading, error };
}

export default useFiles;
