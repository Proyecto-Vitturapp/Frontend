import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui";
import { api } from "../services/api";
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

export default function EditVehicle() {
  const { plate } = useParams();
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    matricula: "",
    anyoFabricacion: "",
    tipoVehiculo: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await api.vehicles.getByPlate(plate);
        setForm({
          marca: data.marca || "",
          modelo: data.modelo || "",
          matricula: data.matricula || "",
          anyoFabricacion: data.anyoFabricacion || "",
          tipoVehiculo: data.tipoVehiculo || "",
        });
      } catch (error) {
        addToast(error.message || "Error al cargar el vehículo", "error");
        navigate("/dashboard/vehicles");
      } finally {
        setFetching(false);
      }
    };

    fetchVehicle();
  }, [plate, addToast, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.vehicle.update(plate, {
        ...form,
        anyoFabricacion: parseInt(form.anyoFabricacion),
      });
      addToast("Vehículo actualizado correctamente", "success");
      navigate("/dashboard/vehicles");
    } catch (error) {
      addToast(error.message || "Error al actualizar el vehículo", "error");
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: "Turismo", label: "Turismo" },
    { value: "Motocicleta", label: "Motocicleta" },
    { value: "Camión", label: "Camion" },
    { value: "Furgoneta", label: "Furgoneta" },
    { value: "Autobús", label: "Autobus" },
    { value: "Remolque", label: "Remolque" },
    { value: "Otro", label: "Otro" },
  ];

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary-500">Cargando vehículo...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(`/dashboard/vehicles/${plate}`)}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1 cursor-pointer"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a los detalles del vehículo
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">
          Editar vehículo
        </h1>
        <p className="text-secondary-500 mt-1">
          Aquí puedes modificar los datos del vehículo con matrícula {form.matricula}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Introduce la marca del vehículo"
                required
              />
              <Input
                label="Modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Introduce el modelo del vehículo"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matricula"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                placeholder="Introduce la matrícula del vehículo"
                required
                disabled
              />
              <Input
                label="Año de fabricación"
                name="anyoFabricacion"
                type="number"
                value={form.anyoFabricacion}
                onChange={handleChange}
                placeholder="Introduce el año de fabricación"
                required
              />
            </div>
            <Select
              label="Tipo de vehículo"
              name="tipoVehiculo"
              value={form.tipoVehiculo}
              onChange={handleChange}
              options={vehicleTypes}
              required
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/vehicles")}
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
