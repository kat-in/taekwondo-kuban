
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import HomePage from './pages/homePage/HomePage'
import NewsPage from './pages/NewsPage'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import BeginnersPage from './pages/BeginnersPage'
import NewsDetailPage from './pages/NewsDetailPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/adminPanelPage/AdminLayout'
import NewsList from './pages/adminPanelPage/NewsList'
import NewsForm from './pages/adminPanelPage/NewsForm'
import AlbumsList from './pages/adminPanelPage/AlbumsList'
import AlbumForm from './pages/adminPanelPage/AlbumForm'
import VideosList from './pages/adminPanelPage/VideosList'
import VideoForm from './pages/adminPanelPage/VideoForm'
import MaterialsLayout from './pages/materialsPage/MaterialsLayout'
import MaterialsRanks from './pages/materialsPage/MaterialsRanks'
import MaterialsPoomsae from './pages/materialsPage/MaterialsPoomsae'
import MaterialsBeltColors from './pages/materialsPage/MaterialsBeltColors'
import MaterialsGlossary from './pages/materialsPage/MaterialsGlossary'
import MaterialsAttestation from './pages/materialsPage/MaterialsAttestation'
import MaterialsCodex from './pages/materialsPage/MaterialsCodex'
import MaterialsRules from './pages/materialsPage/MaterialsRules'
import GalleryPage from './pages/galleryPage/GalleryPage'
import AlbumGalleryPage from './pages/galleryPage/AlbumGalleryPage'
import AddressesPage from './pages/AddressesPage'



function App() {

  return (
    <Router>
      <Header />
      <PageRoutes />
      <ScrollToTopButton />
      <Footer />
    </Router >
  )
}

function PageRoutes() {
  const location = useLocation()
  const isLoginOpen = location.pathname === '/login'

  return (
    <>
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
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/:albumId" element={<AlbumGalleryPage />} />
        <Route path="/photo/*" element={<Navigate to="/gallery/*" />} />
        <Route path="/beginners" element={<BeginnersPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={localStorage.getItem('token') ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/admin/news" />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/new" element={<NewsForm />} />
          <Route path="news/:id/edit" element={<NewsForm />} />
          <Route path="albums" element={<AlbumsList />} />
          <Route path="albums/new" element={<AlbumForm />} />
          <Route path="albums/:id/edit" element={<AlbumForm />} />
          <Route path="videos" element={<VideosList />} />
          <Route path="videos/new" element={<VideoForm />} />
          <Route path="videos/:id/edit" element={<VideoForm />} />
        </Route>
      </Routes>
      {isLoginOpen && <LoginPage />}
    </>
  )
}

export default App
