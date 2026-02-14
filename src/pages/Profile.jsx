import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  Send,
  User,
  Edit2,
  CheckCircle,
  MessageCircle,
  Mail,
  Trash2,
  Smartphone,
  Lock as LockIcon,
  AlertCircle,
  Copy,
  RefreshCw, // Agregamos estos
} from "lucide-react";
import "../styles/pages/Profile/profile.css";

export function Profile() {
  const { session, nickname, idTelegram } = useAuth();
  const [telegramToken, setTelegramToken] = useState(""); // Cambiamos ID por Token
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [localIdTelegram, setLocalIdTelegram] = useState(idTelegram);

  // Cargar el token al iniciar (asumiendo que se guarda en la columna telegram_token)
  useEffect(() => {
    const fetchToken = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("telegram_token, telegram_id")
        .eq("id", session.user.id)
        .single();

      if (data?.telegram_token) setTelegramToken(data.telegram_token);
    };
    fetchToken();
  }, [session]);

  useEffect(() => {
    setLocalIdTelegram(idTelegram);
  }, [idTelegram]);

  const showPopUp = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // --- LÓGICA CYMAX: GENERACIÓN DE TOKEN ÚNICO ---
  const generateCymaxToken = async () => {
    setLoading(true);
    // Generamos un código de 8 caracteres (letras y números)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let newToken = "";
    for (let i = 0; i < 8; i++) {
      newToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          telegram_token: newToken,
          telegram_id: null, // Reseteamos el ID vinculado al generar nuevo token
        })
        .eq("id", session.user.id);
      setLocalIdTelegram(null);
      if (error) throw error;

      setTelegramToken(newToken);
      showPopUp("¡Nuevo Token generado!", "success");
    } catch (err) {
      showPopUp("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramToken);
    setCopied(true);
    showPopUp("Token copiado al portapapeles", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlink = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ telegram_id: null, telegram_token: null })
        .eq("id", session.user.id);

      if (error) throw error;

      // --- EL CAMBIO CLAVE ---
      setLocalIdTelegram(null); // Esto hará que el botón cambie a "Generar" al instante
      setTelegramToken("");

      showPopUp("Conexión eliminada correctamente", "success");
    } catch (err) {
      showPopUp("Error al desvincular", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-glass-card">
        <header className="profile-header-section">
          <div className="avatar-gradient">
            <User size={45} color="white" />
          </div>
          <div className="user-text-info">
            <h1>{nickname || "Cargando..."}</h1>
            <div className="user-email">
              <Mail size={14} /> <span>{session?.user.email}</span>
            </div>
            <span className="user-badge">Usuario Verificado</span>
          </div>
        </header>

        <div className="divider" />

        <main className="profile-body-section">
          <div className="section-title">
            <Smartphone size={18} />
            <h3>Integraciones</h3>
          </div>

          {/* TARJETA TELEGRAM ACTUALIZADA A TOKEN */}
          <div className="integration-card telegram">
            <div className="integration-info">
              <div className="integration-icon">
                <Send size={20} />
              </div>
              <div className="integration-details">
                <p>Telegram Bot</p>
                {idTelegram ? (
                  <span className="status linked">
                    <CheckCircle size={12} /> Vinculado
                  </span>
                ) : (
                  <span className="status idle">Pendiente de vinculación</span>
                )}
              </div>
            </div>

            <div className="cymax-token-action">
              {localIdTelegram ? (
                /* ESTADO VINCULADO: Solo botón rojo de acción final */
                <button
                  className="btn-unlink-main"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <Trash2 size={18} />
                  Desvincular Telegram
                </button>
              ) : (
                /* ESTADO NO VINCULADO: Mantenemos el flujo de generación con el basurero */
                <>
                  {telegramToken ? (
                    <div className="token-display-container">
                      <div className="token-box" onClick={handleCopy}>
                        <code>{telegramToken}</code>
                        {copied ? (
                          <CheckCircle size={16} color="#22c55e" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </div>

                      <button
                        className="btn-refresh-token"
                        onClick={generateCymaxToken}
                        disabled={loading}
                        title="Regenerar Token"
                      >
                        <RefreshCw
                          size={14}
                          className={loading ? "spinning" : ""}
                        />
                      </button>

                      {/* Mantenemos el botón de eliminar aquí también por si se arrepiente antes de vincular */}
                      <button
                        className="btn-unlink"
                        onClick={() => setShowConfirmModal(true)}
                        title="Eliminar Token generado"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-generate-cymax"
                      onClick={generateCymaxToken}
                      disabled={loading}
                    >
                      {loading
                        ? "Generando..."
                        : "Generar Token de Vinculación"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* TARJETA WHATSAPP (PRÓXIMAMENTE) */}
          <div className="integration-card whatsapp disabled">
            <div className="integration-info">
              <div className="integration-icon">
                <MessageCircle size={20} />
              </div>
              <div className="integration-details">
                <p>WhatsApp</p>
                <span className="status develop">Próximamente</span>
              </div>
            </div>
            <div className="integration-action">
              <span className="coming-soon-badge">Beta</span>
            </div>
            {/* Overlay Glass para el efecto de "En desarrollo" */}
            <div className="glass-overlay">
              <LockIcon size={16} />
              <span>EN DESARROLLO</span>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="modal-overlay-profile">
          <div className="modal-content">
            <div className="modal-icon-warning">
              <AlertCircle size={40} color="#ef4444" />
            </div>
            <h2>¿Desvincular Telegram?</h2>
            <p>
              Si desvinculas tu cuenta, el bot dejará de reconocer tus mensajes
              y no podrás registrar gastos desde Telegram.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel-telegram"
                onClick={() => setShowConfirmModal(false)}
              >
                No, mantener
              </button>
              <button className="btn-confirm-delete" onClick={handleUnlink}>
                Sí, desvincular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SISTEMA DE NOTIFICACIÓN POPUP */}
      {/* SISTEMA DE NOTIFICACIÓN CON PORTAL */}
      {toast.show &&
        createPortal(
          <div className={`modern-toast ${toast.type}`}>
            <div className="toast-content">
              {toast.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{toast.message}</span>
            </div>
          </div>,
          document.body, // Esto lo manda al final del HTML, fuera de todo riesgo
        )}
    </div>
  );
}
