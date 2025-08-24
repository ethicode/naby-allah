import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { FolderOpen } from '@mui/icons-material';

export default function MediaCard({ name, id }) {
    return (
        <Link to={`/categorie/${id}`} state={{ folderName: name }} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 345, height: '100%', textAlign: 'center',color: 'white' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}