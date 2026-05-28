import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, ErrorScreen } from '../components/ui'
import { Undo2 } from 'lucide-react'
import { useApiCache } from '../hooks/useApiCache'

export default function VehicleDetail() {
  const { plate } = useParams()
  const navigate = useNavigate()
  const { user, isMechanic } = useAuth()
  const { addToast } = useToast()

  const [vehicle, setVehicle] = useState(null)
  const [revisiones, setRevisiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const { data: userVehicles } = useApiCache(
    `vehicles-user-${user?.id}`,
    () => api.vehicles.getAllUserVehicles(user.id),
    !isMechanic && !!user
  )

  const loadData = useCallback(async () => {
    try {
      const [vehicleData, revisionesData] = await Promise.all([
        api.vehicles.getByPlate(plate),
        api.revisiones.getByVehiculo(plate),
      ])
      setVehicle(vehicleData)
      setRevisiones(revisionesData)
    } catch {
      addToast('Error al cargar los datos', 'error')
    } finally {
      setLoading(false)
    }
  }, [plate, addToast])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!isMechanic && userVehicles !== undefined && userVehicles !== null) {
      const isOwner = userVehicles.some(v => v.matricula === plate)
      setAuthorized(isOwner)
      if (!isOwner) {
        setLoading(false)
        return
      }
    } else if (isMechanic) {
      setAuthorized(true)
    }

    if (authorized || isMechanic) {
      loadData()
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isMechanic, userVehicles, plate, loadData, authorized])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-500">Cargando...</div>
      </div>
    )
  }

  if (!isMechanic && !authorized) {
    return (
      <ErrorScreen
        title="Permisos insuficientes"
        message="No puedes ver los detalles de los vehículos que no son de tu propiedad"
        icon="shield"
        backRoute="/dashboard/vehicles"
        backLabel="Volver a la lista de vehículos"
      />
    )
  }

  if (!vehicle) {
    return (
      <ErrorScreen
        title="Vehículo no encontrado"
        message="El vehículo que buscas no existe en el sistema"
        icon="file"
        backRoute="/dashboard/vehicles"
        backLabel="Volver a la lista de vehículos"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard/vehicles')}
            className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1"
          >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a la lista de vehículos
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">
            {vehicle.marca} {vehicle.modelo}
          </h1>
          <p className="text-secondary-500 mt-1">{vehicle.matricula}</p>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate(`/dashboard/vehicles/${plate}/revision/new`)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Revision
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informacion del vehiculo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-secondary-500">Marca</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.marca}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Modelo</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.modelo}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Matricula</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.matricula}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Ano fabricacion</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.anyoFabricacion}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Tipo</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.tipoVehiculo}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historial de revisiones ({revisiones.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {revisiones.length === 0 ? (
              <p className="text-secondary-500 text-sm text-center py-8">
                No hay revisiones registradas
              </p>
            ) : (
              <div className="space-y-4">
                {revisiones.map((revision) => (
                  <div
                    key={revision.id}
                    className="p-4 border border-secondary-200 rounded-lg hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-secondary-900">
                        {revision.fecha ? formatDate(revision.fecha) : 'Sin fecha'}
                      </span>
                      {revision.tipo && (
                        <Badge variant="primary">{revision.tipo}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600">{revision.descripcion}</p>
                    {revision.mecanico && (
                      <p className="text-xs text-secondary-400 mt-2">
                        Mecanico: {revision.mecanico}
                      </p>
                    )}
                    {revision.coste && (
                      <p className="text-sm font-medium text-primary-600 mt-2">
                        {revision.coste} EUR
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
