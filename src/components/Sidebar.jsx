import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react';
import { CarFront, House } from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isMechanic } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: 'home' },
    { path: '/dashboard/vehicles', label: 'Vehiculos', icon: 'car' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderIcon = (icon) => {
    const icons = {
      home: (
        <House className="w-5 h-5" />
      ),
      car: (
        <CarFront className="w-5 h-5" />
      ),
    }
    return icons[icon]
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-secondary-200 z-50 transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-secondary-200">
            <div className="flex items-center gap-3">
              <img src="/vitturapp-logo.png" alt="VitturApp" className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-secondary-900 text-lg">VitturApp</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                }`}
              >
                {renderIcon(item.icon)}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-secondary-200">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">{user?.name || user?.username || 'Usuario'}</p>
                <p className="text-xs text-secondary-500 truncate">{isMechanic ? 'Mecánico' : 'Cliente'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-secondary-100 hover:text-error transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white border-b border-secondary-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-secondary-900 lg:hidden">VitturApp</h2>
            <div className="hidden lg:block" />
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
