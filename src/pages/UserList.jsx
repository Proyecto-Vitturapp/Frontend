import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, Table, Button } from '../components/ui'
import { Modal } from '../components/ui/Modal'
import { api } from '../services/api'
import { useApiCache } from '../hooks/useApiCache'
import { Eye, Pencil, Trash2, Users } from 'lucide-react'

export default function UserList() {
  const { user, isMechanic } = useAuth()
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const { data: users = [], loading: usersLoading, refresh: refreshUsers } = useApiCache(
    'users-all',
    () => api.users.getAll(),
    !!user
  )

  const loading = usersLoading

  const handleEdit = (id) => {
    navigate(`/dashboard/users/update/${id}`)
  }

  const handleDeleteClick = (userItem) => {
    setUserToDelete(userItem)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return
    try {
      await api.user.delete(userToDelete.idUsuario)
      setDeleteModalOpen(false)
      setUserToDelete(null)
      refreshUsers()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
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
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fechaCreacion', label: 'Fecha de creación', render: (value) => value ? formatDate(value) : 'Sin fecha' },
  ]

  if (isMechanic) {
    columns.push({
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/users/${row.idUsuario}`)
            }}
            className="cursor-pointer"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row.idUsuario)
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
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-500">Cargando usuarios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex gap-2">
            <Users className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-secondary-900">Usuarios</h1>
          </div>
          <p className="text-secondary-500 mt-1">
            Aquí puedes ver todos {isMechanic ? 'los usuarios registrados en el taller' : 'tu información de usuario'}
          </p>
        </div>
        {isMechanic && (
          <Button onClick={() => navigate('/dashboard/users/new')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo usuario
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Todos {isMechanic ? 'los' : 'tus'} usuarios registrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={users}
            onRowClick={(userItem) => navigate(`/dashboard/users/${userItem.idUsuario}`)}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setUserToDelete(null)
        }}
        title={`Eliminar usuario ${userToDelete?.nombre} ${userToDelete?.apellido}`}
      >
        <div className="space-y-4">
          <p className="text-secondary-700">
            ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre} {userToDelete?.apellido}</strong> con username <strong>{userToDelete?.username}</strong>?
          </p>
          <p className="text-secondary-700">
            En caso de que tenga vehículos asociados, estos también serán eliminados. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {
                setDeleteModalOpen(false)
                setUserToDelete(null)
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
