import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import ConferenceDetail from './pages/ConferenceDetail.jsx'
import Login from './pages/Login.jsx'
import ConferencesAdmin from './pages/ConferencesAdmin.jsx'
import UsersAdmin from './pages/UserAdmin.jsx'
import AdminRoute from './components/AdminRoute.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conf/:id" element={<ConferenceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/conferences" element={<ConferencesAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
