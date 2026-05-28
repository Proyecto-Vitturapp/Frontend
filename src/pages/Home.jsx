import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { CarFront, Users, Wrench, Pencil, ClipboardClock } from 'lucide-react';

export default function Home() {
  const { user, isMechanic, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-secondary-500">Cargando...</div>
      </div>
    );
  }

  const renderIcon = (icon) => {
    const icons = {
      Car: (
        <CarFront className="w-6 h-6" />
      ),
      Wrench: (
        <Wrench className="w-6 h-6" />
      ),
      Pencil: (
        <Pencil className="w-6 h-6" />
      ),
      Users: (
        <Users className="w-6 h-6" />
      ),
      ClipboardClock: (
        <ClipboardClock className="w-6 h-6" />
      ) 
    };
    return icons[icon];
  };

  const stats = isMechanic
    ? [
        { label: "Vehículos registrados", value: "--", icon: "Car" },
        { label: "Vehículos en taller", value: "--", icon: "Wrench" },
        { label: "Revisiones realizadas", value: "--", icon: "Pencil" },
        { label: "Clientes registrados", value: "--", icon: "Users" },
      ]
    : [
        { label: "Vehículos en propiedad", value: "--", icon: "Car" },
        { label: "Ultima revision", value: "--", icon: "Wrench" },
        { label: "Proxima revisión", value: "--", icon: "ClipboardClock" },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Bienvenido, {user?.name || user?.username || "Usuario"}
        </h1>
        <p className="text-secondary-500 mt-1">
          Desde este panel podrás tener un control sobre{" "}
          {isMechanic
            ? "todos los vehículos del taller"
            : "tus vehículos que traes a este taller"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                {renderIcon(stat.icon)}
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">
                  {stat.value}
                </p>
                <p className="text-sm text-secondary-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-500 text-sm">
            Conecta la API para ver la actividad reciente aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
