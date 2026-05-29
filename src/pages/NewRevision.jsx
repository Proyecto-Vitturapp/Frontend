import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui";
import { api } from "../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Button,
} from "../components/ui";
import { Undo2 } from "lucide-react";

export default function NewRevision() {
  const { plate } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    tipo: "",
    descripcion: "",
    coste: "",
    km: "",
    proximaRevision: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formatDate = (dateStr) => {
        if (!dateStr) return null
        const [year, month, day] = dateStr.split("-")
        return `${day}-${month}-${year}`
      }

      const payload = {
        matricula: plate,
        idUsuario: user.id,
        fechaRevision: formatDate(form.fecha),
        kilometrajeActual: parseInt(form.km) || 0,
        diagnosticoResultado: form.descripcion,
        importe: parseFloat(form.coste) || 0,
        fechaProximoMantenimiento: formatDate(form.proximaRevision),
      }
      console.log('Payload:', JSON.stringify(payload, null, 2))
      await api.review.create(payload);
      addToast("Revision registrada correctamente", "success");
      navigate(`/dashboard/vehicles/${plate}`);
    } catch (error) {
      addToast(error.message || "Error al registrar la revision", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(`/dashboard/vehicles/${plate}`)}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a los detalles del vehículo
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">
          Nueva revisión
        </h1>
        <p className="text-secondary-500 mt-1">
          Aquí puedes registrar una nueva revisión para el vehículo conmatrícula {plate}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la revisión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                required
              />
              <Input
                label="Coste"
                name="coste"
                type="number"
                value={form.coste}
                onChange={handleChange}
                placeholder="Introduce el coste en euros (€)"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kilómetros actuales"
                name="km"
                type="number"
                value={form.km}
                onChange={handleChange}
                placeholder="Introduce los kilómetros actuales del vehículo"
              />
              <Input
                label="Próxima revisión"
                name="proximaRevision"
                type="date"
                value={form.proximaRevision}
                onChange={handleChange}
                placeholder="Selecciona la fecha de la próxima revisión"
              />
            </div>

            <Textarea
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe lo que se ha hecho en esta revisión..."
              required
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Registrando..." : "Registrar revisión"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/dashboard/vehicles/${plate}`)}
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
