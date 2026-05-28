import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui'

export default function DashboardHome() {
  const { user, isMechanic, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-secondary-500">Cargando...</div>
      </div>
    )
  }

  const stats = isMechanic
    ? [
        { label: 'Vehiculos en taller', value: '--', icon: 'car' },
        { label: 'Revisiones este mes', value: '--', icon: 'calendar' },
        { label: 'Clientes activos', value: '--', icon: 'users' },
      ]
    : [
        { label: 'Mis vehiculos', value: '--', icon: 'car' },
        { label: 'Ultima revision', value: '--', icon: 'calendar' },
        { label: 'Proxima revision', value: '--', icon: 'clock' },
      ]

  const renderIcon = (icon) => {
    const icons = {
      car: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v-4m-6 8h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
      calendar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      clock: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[icon]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Bienvenido, {user?.name || user?.username || 'Usuario'}
        </h1>
        <p className="text-secondary-500 mt-1">
          Desde este panel podrás tener un control sobre {isMechanic ? 'todos los vehículos del taller' : 'tus vehículos que traes a este taller'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                {renderIcon(stat.icon)}
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-500 text-sm">
            Conecta la API para ver la actividad reciente aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
