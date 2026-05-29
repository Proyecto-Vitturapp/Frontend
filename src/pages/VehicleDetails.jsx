import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, ErrorScreen } from '../components/ui'
import { Undo2, Plus, Pencil } from 'lucide-react'
import { useApiCache } from '../hooks/useApiCache'

export default function VehicleDetails() {
  const { plate } = useParams()
  const navigate = useNavigate()
  const { user, isMechanic } = useAuth()
  const { addToast } = useToast()

  const [vehicle, setVehicle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userNames, setUserNames] = useState({})
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
      const reviews = Array.isArray(revisionesData) ? revisionesData : revisionesData ? [revisionesData] : []
      setVehicle(vehicleData)
      setReviews(reviews)

      const userIds = [...new Set(reviews.map(r => r.idCliente).filter(Boolean))]
      const names = {}
      await Promise.all(
        userIds.map(async (id) => {
          try {
            const user = await api.users.getById(id)
            names[id] = `${user.nombre} ${user.apellido || ''} ${user.segundoApellido || ''}`.trim()
          } catch {
            names[id] = 'Usuario desconocido'
          }
        })
      )
      setUserNames(names)
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
        buttonRoute="/dashboard/vehicles"
        buttonLabel="Volver a la lista de vehículos"
      />
    )
  }

  if (!vehicle) {
    return (
      <ErrorScreen
          title="Sin revisiones"
          message={`No hay revisiones registradas para el vehículo con matrícula ${vehicle.matricula}`}
          icon="file"
          buttonRoute={`/dashboard/vehicles/${vehicle.matricula}/revision/new`}
          buttonLabel="Nueva revisión"
          buttonIcon={Plus}
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
          <p className="text-secondary-500 mt-1">
            Aquí puedes ver los datos del vehículo con matrícula {vehicle.matricula}.
          </p>
        </div>
        {isMechanic && (
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/dashboard/vehicles/update/${plate}`)}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar vehículo
            </Button>
            <Button onClick={() => navigate(`/dashboard/vehicles/${plate}/revision/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva revisión
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-[calc(100vh-10rem)] flex flex-col">
          <CardHeader>
            <CardTitle>Información del vehículo</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
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

        <Card className="lg:col-span-2 h-[calc(100vh-10rem)] flex flex-col">
          <CardHeader>
            <CardTitle>Historial de revisiones ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {reviews.length === 0 ? (
              <ErrorScreen
                title="No hay revisiones"
                message={`No hay revisiones registradas para el vehículo con matrícula ${vehicle.matricula}`}
                icon="file"
              />
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
                        {revision.idCliente && userNames[revision.idCliente] && (
                          <span className="font-normal text-secondary-500 ml-2">
                            por {userNames[revision.idCliente]}
                          </span>
                        )}
                      </span>
                      {revision.kilometrajeActual && (
                        <Badge variant="primary">{revision.kilometrajeActual.toLocaleString()} km</Badge>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600">{revision.diagnosticoResultado}</p>
                    {revision.importe && (
                      <p className="text-sm font-medium text-primary-600 mt-2">
                        {revision.importe.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
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
