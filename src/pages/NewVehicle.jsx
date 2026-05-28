import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Select } from '../components/ui'

export default function NewVehicle() {
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    matricula: '',
    anyoFabricacion: '',
    tipoVehiculo: '',
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
      await api.vehicles.create({
        ...form,
        anyoFabricacion: parseInt(form.anyoFabricacion),
      })
      addToast('Vehiculo creado correctamente', 'success')
      navigate('/dashboard/vehicles')
    } catch (error) {
      addToast(error.message || 'Error al crear el vehiculo', 'error')
    } finally {
      setLoading(false)
    }
  }

  const vehicleTypes = [
    { value: 'TURISMO', label: 'Turismo' },
    { value: 'MOTOCICLETA', label: 'Motocicleta' },
    { value: 'CAMION', label: 'Camion' },
    { value: 'FURGONETA', label: 'Furgoneta' },
    { value: 'AUTOBUS', label: 'Autobus' },
    { value: 'REMOLQUE', label: 'Remolque' },
    { value: 'OTRO', label: 'Otro' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/dashboard/vehicles')}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a vehiculos
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">Nuevo Vehiculo</h1>
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
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Ej: Seat"
                required
              />
              <Input
                label="Modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej: Ibiza"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matricula"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                placeholder="Ej: 1234 ABC"
                required
              />
              <Input
                label="Ano de fabricacion"
                name="anyoFabricacion"
                type="number"
                value={form.anyoFabricacion}
                onChange={handleChange}
                placeholder="Ej: 2020"
                required
              />
            </div>
            <Select
              label="Tipo de vehiculo"
              name="tipoVehiculo"
              value={form.tipoVehiculo}
              onChange={handleChange}
              options={vehicleTypes}
              required
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Vehiculo'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/vehicles')}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
