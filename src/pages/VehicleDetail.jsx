import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, ErrorScreen } from '../components/ui'
import { Undo2, Plus } from 'lucide-react'
import { useApiCache } from '../hooks/useApiCache'

export default function VehicleDetail() {
  const { plate } = useParams()
  const navigate = useNavigate()
  const { user, isMechanic } = useAuth()
  const { addToast } = useToast()

  const [vehicle, setVehicle] = useState(null)
  const [reviews, setReviews] = useState([])
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
        api.reviews.getByVehiculo(plate),
      ])
      setVehicle(vehicleData)
      setReviews(Array.isArray(revisionesData) ? revisionesData : revisionesData ? [revisionesData] : [])
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
            className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1 cursor-pointer"
          >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a la lista de vehículos
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">
            {vehicle.marca} {vehicle.modelo} ({vehicle.matricula})
          </h1>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate(`/dashboard/vehicles/${plate}/revision/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva revisión
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información del vehículo</CardTitle>
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
                <dt className="text-sm text-secondary-500">Matrícula</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.matricula}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Año de fabricación</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.anyoFabricacion}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Tipo de vehículo</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.tipoVehiculo}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Fecha próxima revisión</dt>
                <dd className="text-sm font-medium text-secondary-900">{vehicle.fechaProximoMantenimiento ? formatDate(vehicle.fechaProximoMantenimiento) : 'Sin fecha'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historial de revisiones ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="text-secondary-500 text-sm text-center py-8">
                No hay revisiones registradas
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((revision) => (
                  <div
                    key={revision.idRevision}
                    className="p-4 border border-secondary-200 rounded-lg hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-secondary-900">
                        {revision.fechaRevision ? formatDate(revision.fechaRevision) : 'Sin fecha'}
                      </span>
                      {revision.kilometrajeActual && (
                        <Badge variant="primary">{revision.kilometrajeActual.toLocaleString()} km</Badge>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600">{revision.diagnosticoResultado}</p>
                    {revision.importe && (
                      <p className="text-sm font-medium text-primary-600 mt-2">
                        {revision.importe.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR
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
