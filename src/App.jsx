import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import CarList from './pages/CarList'
import CarDetail from './pages/CarDetail'
import NewCar from './pages/NewCar'
import NewVisit from './pages/NewVisit'

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
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="cars" element={<CarList />} />
              <Route path="cars/:id" element={<CarDetail />} />
              <Route
                path="cars/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewCar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cars/:id/visit/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewVisit />
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
