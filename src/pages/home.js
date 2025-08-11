import React, { useEffect, useState } from 'react';
import GoogleDriveFolderList from '../components/googledrivefolderlist';
import BottomPlayer from '../components/bottomPlayer';
import { gapi } from 'gapi-script';
import { AppBar, Button, Container } from '@mui/material';

const CLIENT_ID = '771802916285-131nj7j24l5v1m2ia5m3ho1oa2ml7a87.apps.googleusercontent.com'; // Remplace par ton ID client
const API_KEY = 'AIzaSyA-JKB6f93YcyDFgz0KRuOuX9hWSHeFb5I'; // Remplace par ta clé API
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

function Home({ files, onSelect }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [audio, setAudio] = useState(null); // Ajout d'un état pour l'audio

    useEffect(() => {
        gapi.load('client:auth2', initializeGoogleAPI);
    }, []);

    const initializeGoogleAPI = async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });

        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    };

    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            setIsAuthenticated(true);
            const userProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            setUser(userProfile);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const handleSignIn = () => {
        gapi.auth2.getAuthInstance().signIn().then(
            () => {
                console.log("Connecté avec succès");
            },
            (error) => {
                console.error("Erreur d'authentification", error);
            }
        );
    };

    const handleSignOut = () => {
        gapi.auth2.getAuthInstance().signOut();
    };

    return (
        <Container sx={{ marginTop: 5 }}>
            <GoogleDriveFolderList setAudio={setAudio} />
        </Container>
    );
}
export default Home;




