import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading"; // Usamos tu componente de carga estándar

export function Papelera() {
  // 1. CONSUMO DEL CONTEXTO GLOBAL
  const { session, idTelegram, authLoading, refreshGastos } = useAuth();
  const [papelera, setPapelera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Carga inicial al detectar la sesión y el ID de Telegram
  useEffect(() => {
    if (!authLoading && idTelegram) {
      fetchTrash();
    }
  }, [idTelegram, authLoading]);

  // 2. FUNCIÓN DE CARGA FILTRADA POR USUARIO
  async function fetchTrash() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gastos")
        .select("*")
        .eq("id_telegram", idTelegram) // Filtro de seguridad BI
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

  // 3. RESTAURACIÓN CON SINCRONIZACIÓN GLOBAL
  async function handleRestore(id) {
    try {
      const { error } = await supabase
        .from("gastos")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;

      // Actualizamos la lista local de la papelera
      await fetchTrash();

      // NOTIFICAMOS AL CONTEXTO GLOBAL: Esto actualiza el Dashboard y Detalle
      await refreshGastos();

      setToast({
        show: true,
        message: "¡Movimiento restaurado! ✨",
        type: "success",
      });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (err) {
      console.error("Error al restaurar:", err);
      alert("No se pudo restaurar el movimiento");
    }
  }

  // Pantalla de carga para el S24
  if (authLoading || (loading && papelera.length === 0)) {
    return <Loading />;
  }

  return (
    <>
      {toast.show && (
        <div
          className="toast-notification"
          style={
            toast.type === "success"
              ? {
                  backgroundColor: "#064e3b",
                  color: "#3ec016",
                  border: "1px solid #119605",
                }
              : {
                  backgroundColor: "#4e0606ad",
                  color: "#c01616",
                  border: "1px solid #960505",
                }
          }
        >
          {toast.message}
        </div>
      )}
      <div className="papelera-page">
        <header className="papelera-header">
          <h1>
            Papelera Reciente {/* Contador dinámico */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-trash"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 7l16 0" />
              <path d="M10 11l0 6" />
              <path d="M14 11l0 6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </h1>
          <p>
            Tienes <span className="badge-count">({papelera.length})</span>{" "}
            movimientos que pueden ser restaurados a tus reportes.
          </p>
        </header>

        <div className="papelera-grid">
          {papelera.length === 0 ? (
            <p className="empty-msg">La papelera está vacía.</p>
          ) : (
            papelera.map((g) => (
              <article className="papelera-item" key={g.id}>
                <div className="item-main">
                  <span className="item-date">
                    Eliminado: {g.deleted_at?.split("T")[0]}{" "}
                    {g.deleted_at?.split("T")[1].slice(0, 5)}
                  </span>
                  <h2 className="item-desc">{g.description_user}</h2>
                  <span className="item-cat">{g.category}</span>
                </div>

                <div className="item-side">
                  <span className="item-amount">
                    ${Number(g.amount).toLocaleString("es-CL")}
                  </span>
                  <button
                    onClick={() => handleRestore(g.id)}
                    className="btn-restore-circle"
                    title="Restaurar"
                  >
                    🔄
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}
