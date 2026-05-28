import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Table, Button } from '../components/ui'

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isMechanic } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const loadVehicles = useCallback(async () => {
    try {
      const data = isMechanic
        ? await api.vehicles.getAll()
        : await api.users.getVehicles(user.id)
      setVehicles(data)
    } catch {
      addToast('Error al cargar los vehiculos', 'error')
    } finally {
      setLoading(false)
    }
  }, [isMechanic, user, addToast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVehicles()
  }, [loadVehicles])

  const columns = [
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'matricula', label: 'Matricula' },
    { key: 'anyoFabricacion', label: 'Ano' },
    { key: 'tipoVehiculo', label: 'Tipo' },
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
            Aquí podrás ver todos {isMechanic ? 'los vehículos registrados en el taller' : 'tus vehículos que traes a este taller'}
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
            {isMechanic ? 'Todos los vehículos' : 'Tus vehículos'}
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
