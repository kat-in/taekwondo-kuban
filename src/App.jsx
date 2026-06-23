
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import NotFound from './pages/NotFound'
import LearnPage from './pages/materials/LearnPage'
import AboutPage from './pages/AboutPage'
import BeginnersPage from './pages/BeginnersPage'
import MasterVisitPage from './pages/MaterVisitPage'
import NewsDetailPage from './pages/NewsDetailPage'
import LoginPage from './pages/LoginPage'
import AdminLayout  from './pages/adminPanelPage/AdminLayout'



function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/beginners" element={<BeginnersPage />} />
        <Route path="/master-visit" element={<MasterVisitPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={localStorage.getItem('token') ? <AdminLayout /> : <Navigate to="/login"/>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
