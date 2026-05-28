import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  FileX,
  WifiOff,
} from "lucide-react";
import { Button } from "./Button";

const icons = {
  warning: AlertTriangle,
  shield: ShieldAlert,
  file: FileX,
  wifi: WifiOff,
};

export function ErrorScreen({
  title = "Algo salió mal",
  message = "Ha ocurrido un error inesperado",
  icon = "warning",
  backRoute = "/dashboard",
  backLabel = "Volver al inicio",
}) {
  const navigate = useNavigate();
  const Icon = icons[icon] || icons.warning;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-2">{title}</h1>
      <p className="text-secondary-500 max-w-lg mb-8">{message}</p>
      <Button variant="primary" size="lg" onClick={() => navigate(backRoute)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backLabel}
      </Button>
    </div>
  );
}
