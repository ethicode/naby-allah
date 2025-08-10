import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Category from './pages/Category';
import Home from './pages/home';
import NotFoundPage from './pages/NotFoundPage';
import { Container } from '@mui/material';


function App() {
  return (
    <>
      <div sx={{ background: 'red' }} >
        <BrowserRouter >
          <Header />
          <Routes sx={{ background: 'red' }} >
            <Route path="/naby-allah" element={<Home />} />
            <Route path="/naby-allah/categorie/:folderId" element={<Category />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
