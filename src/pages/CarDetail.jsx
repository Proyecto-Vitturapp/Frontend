import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../components/ui'

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isMechanic } = useAuth()
  const { addToast } = useToast()

  const [car, setCar] = useState(null)
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [carData, visitsData] = await Promise.all([
        api.cars.getById(id),
        api.visits.getByCar(id),
      ])
      setCar(carData)
      setVisits(visitsData)
    } catch {
      addToast('Error al cargar los datos', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, addToast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [loadData])

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

  if (!car) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">Coche no encontrado</p>
        <Button onClick={() => navigate('/dashboard/cars')} className="mt-4">
          Volver
        </Button>
      </div>
    )
  }

  const statusLabels = {
    active: 'Activo',
    in_shop: 'En taller',
    inactive: 'Inactivo',
  }

  const statusVariants = {
    active: 'success',
    in_shop: 'warning',
    inactive: 'error',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard/cars')}
            className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a coches
          </button>
          <h1 className="text-2xl font-bold text-secondary-900">
            {car.brand} {car.model}
          </h1>
          <p className="text-secondary-500 mt-1">{car.plate}</p>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate(`/dashboard/cars/${id}/visit/new`)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Visita
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
                <dd className="text-sm font-medium text-secondary-900">{car.brand}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Modelo</dt>
                <dd className="text-sm font-medium text-secondary-900">{car.model}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Matricula</dt>
                <dd className="text-sm font-medium text-secondary-900">{car.plate}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Ano</dt>
                <dd className="text-sm font-medium text-secondary-900">{car.year}</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Kilometros</dt>
                <dd className="text-sm font-medium text-secondary-900">{car.km?.toLocaleString() || '--'} km</dd>
              </div>
              <div>
                <dt className="text-sm text-secondary-500">Estado</dt>
                <dd>
                  <Badge variant={statusVariants[car.status] || 'default'}>
                    {statusLabels[car.status] || car.status}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historial de visitas ({visits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {visits.length === 0 ? (
              <p className="text-secondary-500 text-sm text-center py-8">
                No hay visitas registradas
              </p>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 border border-secondary-200 rounded-lg hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-secondary-900">
                        {visit.date ? formatDate(visit.date) : 'Sin fecha'}
                      </span>
                      {visit.type && (
                        <Badge variant="primary">{visit.type}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600">{visit.description}</p>
                    {visit.mechanic && (
                      <p className="text-xs text-secondary-400 mt-2">
                        Mecanico: {visit.mechanic}
                      </p>
                    )}
                    {visit.cost && (
                      <p className="text-sm font-medium text-primary-600 mt-2">
                        {visit.cost} EUR
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
