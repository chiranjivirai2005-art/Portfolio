import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Achievements from './pages/Achievements.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Certificates from './pages/Certificates.jsx'
import Courses from './pages/Courses.jsx'
import Extracurricular from './pages/Extracurricular.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/extracurricular" element={<Extracurricular />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
