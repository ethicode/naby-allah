import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Category from './pages/Category';
import Home from './pages/home';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/naby-allah" element={<Home />} />
            <Route path="/naby-allah/categorie/:folderId" element={<Category />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
