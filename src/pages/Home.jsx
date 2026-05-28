import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { CarFront, Users, Wrench, Pencil, ClipboardClock } from "lucide-react";
import { api } from "../services/api";
import { useApiCache } from "../hooks/useApiCache";

export default function Home() {
  const { user, isMechanic, loading: authLoading } = useAuth();

  const { data: vehiculosTotal } = useApiCache(
    'vehicles-all-total',
    api.vehicles.getAllTotal,
    isMechanic
  )

  const { data: vehiculosEnTaller } = useApiCache(
    'vehicles-workshop-total',
    api.vehicles.getInWorkshopTotal,
    isMechanic
  )

  const { data: usuariosTotal } = useApiCache(
    'users-all-total',
    api.users.getAllTotal,
    isMechanic
  )

  const { data: revisionesTotal } = useApiCache(
    'revisiones-total',
    api.revisiones.getTotal,
    isMechanic
  )

  const { data: userVehiclesTotal } = useApiCache(
    `vehicles-user-${user?.id}`,
    () => api.vehicles.getAllUserVehicles(user.id),
    !isMechanic && !!user
  )

  const [statsData, setStatsData] = useState({
    vehiculosRegistrados: "--",
    vehiculosEnTaller: "--",
    revisionesRealizadas: "--",
    clientesRegistrados: "--",
    vehiculosEnPropiedad: "--",
    ultimaRevision: "--",
    proximaRevision: "--",
  });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isMechanic) {
      setStatsData({
        vehiculosRegistrados: vehiculosTotal ?? "--",
        vehiculosEnTaller: vehiculosEnTaller ?? "--",
        revisionesRealizadas: revisionesTotal ?? "--",
        clientesRegistrados: usuariosTotal ?? "--",
        vehiculosEnPropiedad: "--",
        ultimaRevision: "--",
        proximaRevision: "--",
      })
    } else if (user) {
      setStatsData({
        vehiculosRegistrados: "--",
        vehiculosEnTaller: "--",
        revisionesRealizadas: "--",
        clientesRegistrados: "--",
        vehiculosEnPropiedad: userVehiclesTotal?.length ?? "--",
        ultimaRevision: "--",
        proximaRevision: "--",
      })
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isMechanic, user, vehiculosTotal, vehiculosEnTaller, revisionesTotal, usuariosTotal, userVehiclesTotal])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-secondary-500">Cargando...</div>
      </div>
    );
  }

  const renderIcon = (icon) => {
    const icons = {
      Car: <CarFront className="w-6 h-6" />,
      Wrench: <Wrench className="w-6 h-6" />,
      Pencil: <Pencil className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      ClipboardClock: <ClipboardClock className="w-6 h-6" />,
    };
    return icons[icon];
  };

  const stats = isMechanic
    ? [
        {
          label: "Vehículos registrados",
          value: statsData.vehiculosRegistrados,
          icon: "Car",
        },
        {
          label: "Vehículos en taller",
          value: statsData.vehiculosEnTaller,
          icon: "Wrench",
        },
        {
          label: "Revisiones realizadas",
          value: statsData.revisionesRealizadas,
          icon: "Pencil",
        },
        {
          label: "Clientes registrados",
          value: statsData.clientesRegistrados,
          icon: "Users",
        },
      ]
    : [
        {
          label: "Vehículos en propiedad",
          value: statsData.vehiculosEnPropiedad,
          icon: "Car",
        },
        {
          label: "Ultima revision",
          value: statsData.ultimaRevision,
          icon: "Wrench",
        },
        {
          label: "Proxima revisión",
          value: statsData.proximaRevision,
          icon: "ClipboardClock",
        },
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

      <div
        className={`grid grid-cols-1 gap-4 ${
          stats.length === 1
            ? "sm:grid-cols-1"
            : stats.length === 2
            ? "sm:grid-cols-2"
            : stats.length === 3
            ? "sm:grid-cols-3"
            : "sm:grid-cols-4"
        }`}
      >
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
