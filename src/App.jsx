import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import VehicleList from './pages/VehicleList'
import VehicleDetail from './pages/VehicleDetail'
import NewVehicle from './pages/NewVehicle'
import NewRevision from './pages/NewRevision'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Sidebar />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="vehicles" element={<VehicleList />} />
              <Route path="vehicles/:plate" element={<VehicleDetail />} />
              <Route
                path="vehicles/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="vehicles/:plate/revision/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewRevision />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
