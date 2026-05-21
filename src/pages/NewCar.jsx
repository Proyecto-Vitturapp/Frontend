import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Select } from '../components/ui'

export default function NewCar() {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    plate: '',
    year: '',
    km: '',
    clientId: '',
    status: 'active',
  })
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.cars.create({
        ...form,
        year: parseInt(form.year),
        km: parseInt(form.km) || 0,
      })
      addToast('Coche creado correctamente', 'success')
      navigate('/dashboard/cars')
    } catch (error) {
      addToast(error.message || 'Error al crear el coche', 'error')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'in_shop', label: 'En taller' },
    { value: 'inactive', label: 'Inactivo' },
  ]

  return (
    <div className="space-y-6">
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
        <h1 className="text-2xl font-bold text-secondary-900">Nuevo Coche</h1>
        <p className="text-secondary-500 mt-1">Registrar un nuevo vehiculo en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del vehiculo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marca"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ej: Seat"
                required
              />
              <Input
                label="Modelo"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Ej: Ibiza"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matricula"
                name="plate"
                value={form.plate}
                onChange={handleChange}
                placeholder="Ej: 1234 ABC"
                required
              />
              <Input
                label="Ano"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="Ej: 2020"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kilometros"
                name="km"
                type="number"
                value={form.km}
                onChange={handleChange}
                placeholder="Ej: 50000"
              />
              <Select
                label="Estado"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={statusOptions}
              />
            </div>
            <Input
              label="ID del cliente"
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              placeholder="ID del propietario"
              required
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Coche'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/cars')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
