import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import VehicleList from './pages/VehicleList'
import VehicleDetails from './pages/VehicleDetails'
import NewVehicle from './pages/NewVehicle'
import EditVehicle from './pages/EditVehicle'
import NewReview from './pages/NewReview'
import UserList from './pages/UserList'
import NewUser from './pages/NewUser'

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
              <Route path="users" element={<UserList />} />
              <Route path="vehicles/:plate" element={<VehicleDetails />} />
              <Route
                path="vehicles/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="vehicles/update/:plate"
                element={
                  <ProtectedRoute mechanicOnly>
                    <EditVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="vehicles/:plate/revision/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/new"
                element={
                  <ProtectedRoute mechanicOnly>
                    <NewUser />
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
