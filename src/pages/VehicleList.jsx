import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, Table, Button } from '../components/ui'
import { Modal } from '../components/ui/Modal'
import { api } from '../services/api'
import { useApiCache } from '../hooks/useApiCache'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function VehicleList() {
  const { user, isMechanic } = useAuth()
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)

  const vehiclesKey = isMechanic ? 'vehicles-all' : `vehicles-user-${user?.id}`
  const workshopKey = isMechanic ? 'vehicles-workshop' : `vehicles-workshop-user-${user?.id}`

  const { data: vehicles = [], loading: vehiclesLoading, refresh: refreshVehicles } = useApiCache(
    vehiclesKey,
    () => isMechanic ? api.vehicles.getAll() : api.vehicles.getAllUserVehicles(user.id),
    !!user
  )

  const { data: workshopVehicles = [], loading: workshopLoading, refresh: refreshWorkshopVehicles } = useApiCache(
    workshopKey,
    () => isMechanic ? api.vehicles.getInWorkshop() : api.vehicles.getInWorkshopUserVehicles(user.id),
    !!user
  )

  const loading = vehiclesLoading || workshopLoading

  const handleEdit = (plate) => {
    navigate(`/dashboard/vehicles/update/${plate}`)
  }

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return
    try {
      await api.vehicle.delete(vehicleToDelete.matricula)
      setDeleteModalOpen(false)
      setVehicleToDelete(null)
      refreshVehicles()
      refreshWorkshopVehicles()
    } catch (error) {
      console.error('Error al eliminar vehículo:', error)
    }
  }

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

  columns.push({
    key: 'actions',
    label: 'Acciones',
    render: (_, row) => (
      <div className="flex gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/dashboard/vehicles/${row.matricula}`)
          }}
          className="cursor-pointer"
        >
          <Eye className="w-3 h-3" />
        </Button>
        {isMechanic && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(row.matricula)
              }}
              className="cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(row)
              }}
              className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>
    )
  })

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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setVehicleToDelete(null)
        }}
        title={`Eliminar vehículo con matrícula  ${vehicleToDelete?.matricula}`}
      >
        <div className="space-y-4">
          <p className="text-secondary-700">
            ¿Estás seguro de que deseas eliminar el <strong>{vehicleToDelete?.marca} {vehicleToDelete?.modelo}</strong> con matrícula <strong>{vehicleToDelete?.matricula}</strong>?
          </p>
          <p className="text-secondary-700">
            En caso de que tenga registros de revisiones o usuarios asociados, estos también serán eliminados. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {
                setDeleteModalOpen(false)
                setVehicleToDelete(null)
              }}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
