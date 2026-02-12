import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import "../styles/pages/Profile/profile.css"; // Importamos el CSS

export function Profile() {
  const { session, nickname, idTelegram } = useAuth();
  const [telegramIdInput, setTelegramIdInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Sincronizar ID de Telegram del contexto
  useEffect(() => {
    if (idTelegram) {
      setTelegramIdInput(idTelegram);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [idTelegram]);

  const showPopUp = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // La función que abre el modal
  const triggerUnlinkPopup = () => setShowConfirmModal(true);

  // La función que ejecuta la desvinculación real
  const handleUnlink = async () => {
    setLoading(true);
    setShowConfirmModal(false); // Cerramos el modal
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ telegram_id: null })
        .eq("id", session.user.id);

      if (error) throw error;

      setTelegramIdInput("");
      setIsEditing(true);
      showPopUp("Conexión eliminada correctamente", "success");
    } catch (err) {
      showPopUp("Error al desvincular: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const updateTelegramId = async () => {
    if (!telegramIdInput) return showPopUp("Por favor ingresa un ID", "error");

    setLoading(true);
    setHasError(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ telegram_id: telegramIdInput })
        .eq("id", session.user.id);

      if (error) {
        // Captura error de duplicado (ID ya en uso)
        if (error.code === "23505" || error.status === 409) {
          setHasError(true);
          showPopUp("Este ID ya pertenece a otra cuenta", "error");
          return;
        }
        throw error;
      }

      setIsEditing(false);
      showPopUp("¡Vinculación actualizada!", "success");
      // Opcional: window.location.reload() si el AuthContext no actualiza solo
    } catch (err) {
      setHasError(true);
      showPopUp("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-glass-card">
        {/* CABECERA: INFORMACIÓN DE USUARIO */}
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

        {/* CUERPO: INTEGRACIONES */}
        <main className="profile-body-section">
          <div className="section-title">
            <Smartphone size={18} />
            <h3>Integraciones de Mensajería</h3>
          </div>

          {/* TARJETA TELEGRAM */}
          <div
            className={`integration-card telegram ${hasError ? "shake" : ""}`}
          >
            <div className="integration-info">
              <div className="integration-icon">
                <Send size={20} />
              </div>
              <div className="integration-details">
                <p>Telegram Bot</p>
                {idTelegram && !isEditing ? (
                  <span className="status linked">
                    <CheckCircle size={12} /> Vinculado
                  </span>
                ) : (
                  <span className="status idle">Esperando ID</span>
                )}
              </div>
            </div>

            <div className="integration-action">
              <div
                className={`id-input-box ${isEditing ? "active" : "read-only"}`}
              >
                <input
                  type="text"
                  className={!isEditing ? "mask-id" : ""}
                  value={telegramIdInput}
                  onChange={(e) => {
                    setTelegramIdInput(e.target.value);
                    setHasError(false);
                  }}
                  disabled={!isEditing}
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="Ingresa tu ID"
                />

                {/* Este bloque contiene los botones que aparecen cuando NO estamos editando */}
                {!isEditing && idTelegram && (
                  <div className="action-buttons-inner">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="edit-mini-btn"
                      title="Editar ID"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* BOTÓN DE DESVINCULAR */}
                    <button
                      onClick={triggerUnlinkPopup} // <--- Cambiar aquí
                      className="delete-mini-btn"
                      title="Desvincular Telegram"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Botón de Guardar que aparece solo al editar */}
              {isEditing && (
                <button
                  onClick={updateTelegramId}
                  className="save-btn-action"
                  disabled={loading}
                >
                  {loading ? "..." : "Guardar"}
                </button>
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

      {/* SISTEMA DE NOTIFICACIÓN POPUP */}
      {toast.show && (
        <div className={`modern-toast ${toast.type}`}>
          <div className="toast-content">
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <LockIcon size={18} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
    </div>
  );
}
