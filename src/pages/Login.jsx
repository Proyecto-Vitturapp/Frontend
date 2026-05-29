import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui'
import { Input, Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      addToast('Has iniciado sesión correctamente', 'success')
      navigate('/dashboard')
    } catch (error) {
      addToast(error.message || 'Error al iniciar sesión', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <div className="text-center mb-5">
              <img src="/vitturapp-logo.png" alt="VitturApp" className="mx-auto w-20 h-20" />
              <h1 className="text-3xl font-bold text-primary-500">VitturApp</h1>
              <p className="text-primary-500 mt-1">Todo el historial de tus vehículos, en un solo lugar</p>
            </div>
            <CardTitle>Iniciar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                required
              />
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
              />
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-primary-100 text-sm mt-6">
          ¿Problemas para iniciar sesión? ¡Te ayudamos a restablecerla!
        </p>
      </div>
    </div>
  )
}
