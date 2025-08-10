import React, { useEffect, useState } from 'react';

// const clientId = 'TON_CLIENT_ID_GOOGLE'; // Remplace par ton client ID
const clientId = '771802916285-131nj7j24l5v1m2ia5m3ho1oa2ml7a87.apps.googleusercontent.com'; // Remplace par ton ID client
const API_KEY = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I'; // Remplace par ta clé API
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";


const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [driveFiles, setDriveFiles] = useState([]);

  useEffect(() => {
    // Charger l'API Google Client
    window.gapi.load('client:auth2', initClient);
  }, []);

  const initClient = () => {
    window.gapi.client.init({
      apiKey: 'TON_API_KEY_GOOGLE', // Remplace par ton API Key
      clientId: clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
    }).then(() => {
      const authInstance = window.gapi.auth2.getAuthInstance();

      authInstance.isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(authInstance.isSignedIn.get());
    });
  };

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      const user = window.gapi.auth2.getAuthInstance().currentUser.get();
      setUserData(user.getBasicProfile());
      setIsLoggedIn(true);
      listDriveFiles();
    } else {
      setIsLoggedIn(false);
      setUserData(null);
      setDriveFiles([]);
    }
  };

  const handleLogin = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleLogout = () => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  const listDriveFiles = () => {
    window.gapi.client.drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }).then((response) => {
      setDriveFiles(response.result.files);
    });
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Se connecter avec Google</button>
      ) : (
        <div>
          <h2>Bienvenue, {userData?.getName()}</h2>
          <button onClick={handleLogout}>Se déconnecter</button>
          <h3>Fichiers Google Drive :</h3>
          <ul>
            {driveFiles.map((file) => (
              <li key={file.id}>
                <a href={`https://drive.google.com/file/d/${file.id}`} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
