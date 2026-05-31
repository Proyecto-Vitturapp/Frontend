import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui";
import { api } from "../services/api";
import { clearCacheKey } from "../hooks/useApiCache";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Select,
} from "../components/ui";
import { Undo2 } from "lucide-react";

export default function NewUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    first_last_name: "",
    second_last_name: "",
    email: "",
    phone_number: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.user.create({
        username: form.username,
        password: form.password,
        name: form.name,
        first_last_name: form.first_last_name,
        second_last_name: form.second_last_name || "",
        email: form.email,
        phone_number: form.phone_number,
        role: Number(form.role),
      });
      clearCacheKey("users-all");
      addToast("Usuario creado correctamente", "success");
      navigate("/dashboard/users");
    } catch (error) {
      addToast(error.message || "Error al crear el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "0", label: "Cliente" },
    { value: "1", label: "Mecánico" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/dashboard/users")}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1 cursor-pointer"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a la lista de usuarios
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">
          Nuevo usuario
        </h1>
        <p className="text-secondary-500 mt-1">
          Aquí puedes registrar un nuevo usuario en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre de usuario"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Introduce el nombre de usuario"
                required
              />
              <Input
                label="Contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Introduce la contraseña"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Introduce el nombre"
                required
              />
              <Input
                label="Primer apellido"
                name="first_last_name"
                value={form.first_last_name}
                onChange={handleChange}
                placeholder="Introduce el primer apellido"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Segundo apellido"
                name="second_last_name"
                value={form.second_last_name}
                onChange={handleChange}
                placeholder="Introduce el segundo apellido (opcional)"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Introduce el email"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Número de teléfono"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Introduce el número de teléfono"
                required
              />
              <Select
                label="Rol"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={roleOptions}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Creando..." : "Crear usuario"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/users")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
