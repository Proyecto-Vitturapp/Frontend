import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, Table, Button } from '../components/ui'
import { api } from '../services/api'
import { useApiCache } from '../hooks/useApiCache'

export default function VehicleList() {
  const { user, isMechanic } = useAuth()
  const navigate = useNavigate()

  const vehiclesKey = isMechanic ? 'vehicles-all' : `vehicles-user-${user?.id}`
  const workshopKey = isMechanic ? 'vehicles-workshop' : `vehicles-workshop-user-${user?.id}`

  const { data: vehicles = [], loading: vehiclesLoading } = useApiCache(
    vehiclesKey,
    () => isMechanic ? api.vehicles.getAll() : api.vehicles.getAllUserVehicles(user.id),
    !!user
  )

  const { data: workshopVehicles = [], loading: workshopLoading } = useApiCache(
    workshopKey,
    () => isMechanic ? api.vehicles.getInWorkshop() : api.vehicles.getInWorkshopUserVehicles(user.id),
    !!user
  )

  const loading = vehiclesLoading || workshopLoading

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const columns = [
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'anyoFabricacion', label: 'Año de fabricación' },
    { key: 'fechaProximoMantenimiento', label: 'Fecha próxima revisión', render: (value) => value ? formatDate(value) : 'Sin fecha' },
    { key: 'tipoVehiculo', label: 'Tipo de vehículo' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-500">Cargando vehiculos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Vehículos</h1>
          <p className="text-secondary-500 mt-1">
            Aquí puedes ver todos {isMechanic ? 'los vehículos registrados en el taller' : 'tus vehículos que traes a este taller'}
          </p>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate('/dashboard/vehicles/new')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo vehículo
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Todos {isMechanic ? 'los' : 'tus'} vehículos en el taller
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={workshopVehicles}
            onRowClick={(vehicle) => navigate(`/dashboard/vehicles/${vehicle.matricula}`)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Todos {isMechanic ? 'los ' : 'tus'} vehículos registrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={vehicles}
            onRowClick={(vehicle) => navigate(`/dashboard/vehicles/${vehicle.matricula}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
