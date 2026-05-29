import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
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

export default function NewVehicle() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    plate: "",
    fabrication_year: "",
    vehicle_type: "",
  });
  const [loading, setLoading] = useState(false);
  const { user, isMechanic } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.vehicle.create({
        ...form,
        fabrication_year: parseInt(form.fabrication_year),
      });
      clearCacheKey(isMechanic ? "vehicles-all" : `vehicles-user-${user?.id}`);
      clearCacheKey(isMechanic ? "vehicles-workshop" : `vehicles-workshop-user-${user?.id}`);
      addToast("Vehiculo creado correctamente", "success");
      navigate(`/dashboard/vehicles/${form.plate}`);
    } catch (error) {
      addToast(error.message || "Error al crear el vehiculo", "error");
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

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/dashboard/vehicles")}
          className="text-sm text-secondary-500 hover:text-secondary-700 mb-2 flex items-center gap-1 cursor-pointer"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Volver a la lista de vehículos
        </button>
        <h1 className="text-2xl font-bold text-secondary-900">
          Nuevo vehículo
        </h1>
        <p className="text-secondary-500 mt-1">
          Aquí puedes registrar un nuevo vehículo en el sistema
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
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Introduce la marca del vehículo"
                required
              />
              <Input
                label="Modelo"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Introduce el modelo del vehículo"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Matricula"
                name="plate"
                value={form.plate}
                onChange={handleChange}
                placeholder="Introduce la matrícula del vehículo"
                required
              />
              <Input
                label="Año de fabricación"
                name="fabrication_year"
                type="number"
                value={form.fabrication_year}
                onChange={handleChange}
                placeholder="Introduce el año de fabricación"
                required
              />
            </div>
            <Select
              label="Tipo de vehículo"
              name="vehicle_type"
              value={form.vehicle_type}
              onChange={handleChange}
              options={vehicleTypes}
              required
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar vehículo"}
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
