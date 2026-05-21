import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Table, Badge, Button } from '../components/ui'

export default function CarList() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const { isMechanic } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const loadCars = useCallback(async () => {
    try {
      const data = isMechanic ? await api.cars.getAll() : await api.cars.getMyCars()
      setCars(data)
    } catch {
      addToast('Error al cargar los coches', 'error')
    } finally {
      setLoading(false)
    }
  }, [isMechanic, addToast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCars()
  }, [loadCars])

  const columns = [
    { key: 'brand', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
    { key: 'plate', label: 'Matricula' },
    { key: 'year', label: 'Ano' },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => {
        const variants = {
          active: 'success',
          in_shop: 'warning',
          inactive: 'error',
        }
        const labels = {
          active: 'Activo',
          in_shop: 'En taller',
          inactive: 'Inactivo',
        }
        return <Badge variant={variants[value] || 'default'}>{labels[value] || value}</Badge>
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-500">Cargando coches...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Coches</h1>
          <p className="text-secondary-500 mt-1">
            {isMechanic ? 'Todos los coches del taller' : 'Mis coches'}
          </p>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate('/dashboard/cars/new')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Coche
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isMechanic ? 'Listado de coches' : 'Mis vehiculos'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={cars}
            onRowClick={(car) => navigate(`/dashboard/cars/${car.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
