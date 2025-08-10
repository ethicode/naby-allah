export async function fetchFilesFromDrive() {
  try {
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'GET',
      headers: {
        Authorization: `Bearer YOUR_GOOGLE_ACCESS_TOKEN`, // Assure-toi d'utiliser un token valide
      },
    });
    const data = await response.json();
    return data.files;
  } catch (err) {
    console.error('Erreur lors de la récupération des fichiers:', err);
    throw new Error('Impossible de récupérer les fichiers');
  }
}
