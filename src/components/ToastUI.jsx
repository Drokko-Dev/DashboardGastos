import { createPortal } from "react-dom";
import { CheckCircle, AlertCircle } from "lucide-react"; // O los que uses
import "../styles/pages/toast_ui.css"; // Asegúrate de tener estilos para el toast

export const ToastUI = ({ toast, isExiting }) => {
  if (!toast.show) return null;

  const isWelcome =
    toast.message?.includes("Buenos días") || toast.message?.includes("Buenas");

  return createPortal(
    <div
      className={`global-finance-toast ${toast.type} ${isWelcome ? "welcome-variant" : ""} ${isExiting ? "absorbing" : ""}`}
    >
      <div className="finance-toast-content">
        {isWelcome ? <span className="welcome-icon">✨</span> : null}
        <span>{toast.message}</span>
      </div>
    </div>,
    document.body,
  );
};
