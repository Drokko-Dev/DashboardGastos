import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { RotateCcw, Trash2 } from "lucide-react"; // Usamos iconos pro

export function Papelera() {
  const { session, authLoading, refreshGastos } = useAuth();
  const [papelera, setPapelera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    // Si la sesión está lista, cargamos por User ID
    if (!authLoading && session?.user?.id) {
      fetchTrash();
    }
  }, [session, authLoading]);

  async function fetchTrash() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("transacciones") // Cambiado a transacciones
        .select("*")
        .eq("user_id", session.user.id) // Filtro maestro por UUID de Auth
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;
      setPapelera(data);
    } catch (err) {
      console.error("Error en la carga de papelera:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id) {
    try {
      const { error } = await supabase
        .from("transacciones")
        .update({ deleted_at: null })
        .eq("id", id)
        .eq("user_id", session.user.id); // Seguridad extra

      if (error) throw error;

      await fetchTrash();
      await refreshGastos();

      setToast({
        show: true,
        message: "¡Movimiento restaurado! ✨",
        type: "success",
      });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (err) {
      console.error("Error al restaurar:", err);
    }
  }

  if (authLoading || (loading && papelera.length === 0)) {
    return <Loading />;
  }

  return (
    <>
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="papelera-page">
        <header className="papelera-header">
          <h1>
            Papelera <Trash2 size={24} className="icon-trash" />
          </h1>
          <p>
            Tienes <span className="badge-count">({papelera.length})</span>{" "}
            movimientos que pueden ser restaurados.
          </p>
        </header>

        <div className="papelera-grid">
          {papelera.length === 0 ? (
            <div className="empty-state">
              <p className="empty-msg">Tu papelera está limpia.</p>
            </div>
          ) : (
            papelera.map((g) => {
              // Lógica de fecha para Chile
              const fechaEliminado = new Date(g.deleted_at);
              const fechaFmt = fechaEliminado.toLocaleDateString("es-CL");
              const horaFmt = fechaEliminado.toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <article className="papelera-item" key={g.id}>
                  <div className="item-main">
                    <span className="item-date">
                      Eliminado: {fechaFmt} a las {horaFmt} hrs
                    </span>
                    <h2 className="item-desc">{g.description_user}</h2>
                    <span className="item-cat">{g.category}</span>
                  </div>

                  <div className="item-side">
                    <span className={`item-amount ${g.type}`}>
                      ${Number(g.amount).toLocaleString("es-CL")}
                    </span>
                    <button
                      onClick={() => handleRestore(g.id)}
                      className="btn-restore-circle"
                      title="Restaurar"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
