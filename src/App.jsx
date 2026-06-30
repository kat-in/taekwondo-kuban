
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
import AboutPage from './pages/AboutPage'
import BeginnersPage from './pages/BeginnersPage'
import NewsDetailPage from './pages/NewsDetailPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/adminPanelPage/AdminLayout'
import MaterialsLayout from './pages/materialsPage/MaterialsLayout'
import MaterialsRanks from './pages/materialsPage/MaterialsRanks'
import MaterialsPoomsae from './pages/materialsPage/MaterialsPoomsae'
import MaterialsBeltColors from './pages/materialsPage/MaterialsBeltColors'
import MaterialsGlossary from './pages/materialsPage/MaterialsGlossary'
import MaterialsAttestation from './pages/materialsPage/MaterialsAttestation'
import MaterialsCodex from './pages/materialsPage/MaterialsCodex'
import MaterialsRules from './pages/materialsPage/MaterialsRules'



function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/materials" element={<MaterialsLayout />} >
          <Route index element={<Navigate to="/materials/attestation" />} />
          <Route path="ranks" element={<MaterialsRanks />} />
          <Route path="poomsae" element={<MaterialsPoomsae />} />
          <Route path="belt-colors" element={<MaterialsBeltColors />} />
          <Route path="glossary" element={<MaterialsGlossary />} />
          <Route path="attestation" element={<MaterialsAttestation />} />
          <Route path="codex" element={<MaterialsCodex />} />
          <Route path="rules" element={<MaterialsRules />} />
        
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/beginners" element={<BeginnersPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={localStorage.getItem('token') ? <AdminLayout /> : <Navigate to="/login" />} />
      </Routes>
      <Footer />
    </Router >
  )
}

export default App
