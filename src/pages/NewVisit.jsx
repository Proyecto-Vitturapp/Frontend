import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../components/ui'
import { api } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Button, Select } from '../components/ui'

export default function NewVisit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    cost: '',
    km: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.visits.create(id, {
        ...form,
        cost: parseFloat(form.cost) || 0,
        km: parseInt(form.km) || 0,
      })
      addToast('Visita registrada correctamente', 'success')
      navigate(`/dashboard/cars/${id}`)
    } catch (error) {
      addToast(error.message || 'Error al registrar la visita', 'error')
    } finally {
      setLoading(false)
    }
  }

  const visitTypes = [
    { value: 'revision', label: 'Revision' },
    { value: 'reparacion', label: 'Reparacion' },
    { value: 'cambio_aceite', label: 'Cambio de aceite' },
    { value: 'neumaticos', label: 'Neumaticos' },
    { value: 'frenos', label: 'Frenos' },
    { value: 'otro', label: 'Otro' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(`/dashboard/cars/${id}`)}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al coche
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">Nueva Visita</h1>
        <p className="text-secondary-500 mt-1">Registrar una nueva visita para el vehiculo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la visita</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <Select
                label="Tipo de visita"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={visitTypes}
                required
              />
            </div>
            <Textarea
              label="Descripcion"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe lo que se ha hecho en esta visita..."
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Coste (EUR)"
                name="cost"
                type="number"
                value={form.cost}
                onChange={handleChange}
                placeholder="0.00"
              />
              <Input
                label="Kilometros actuales"
                name="km"
                type="number"
                value={form.km}
                onChange={handleChange}
                placeholder="Km del vehiculo"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Registrar Visita'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/dashboard/cars/${id}`)}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
