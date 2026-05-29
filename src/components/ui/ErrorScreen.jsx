import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  FileX,
  WifiOff,
  Plus,
} from "lucide-react";
import { Button } from "./Button";

const icons = {
  warning: AlertTriangle,
  shield: ShieldAlert,
  file: FileX,
  wifi: WifiOff,
  plus: Plus,
};

export function ErrorScreen({
  title = "Algo ha salido mal",
  message = "Ha ocurrido un error inesperado",
  icon = "warning",
  buttonRoute = "/dashboard",
  buttonLabel = "Volver al inicio",
  buttonIcon: ButtonIcon = ArrowLeft,
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
      <Button variant="primary" size="lg" onClick={() => navigate(buttonRoute)}>
        {ButtonIcon && <ButtonIcon className="w-4 h-4 mr-2" />}
        {buttonLabel}
      </Button>
    </div>
  );
}
