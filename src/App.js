import Header from './components/Header';
import { HashRouter, Route, Routes } from 'react-router-dom';  // Remplace BrowserRouter par HashRouter
import Category from './pages/Category';
import Home from './pages/home';
import NotFoundPage from './pages/NotFoundPage';
import { Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
      <HashRouter> {/* Utilisation de HashRouter au lieu de BrowserRouter */}
        <Header />
        <Routes sx={{ background: 'red' }}>
          <Route path="/naby-allah" element={<Home />} />
          <Route path="/naby-allah/categorie/:folderId" element={<Category />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
