import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "./Navbar";
import CryptoJS from "crypto-js";

export function Papelera() {
  const { session } = useAuth();
  const [papelera, setPapelera] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) fetchTrash();
  }, [session]);

  async function fetchTrash() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gastos")
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (error) throw error;

      const decrypted = data.map((g) => {
        try {
          const amount = CryptoJS.AES.decrypt(
            g.amount,
            session.user.id,
          ).toString(CryptoJS.enc.Utf8);
          const desc = CryptoJS.AES.decrypt(
            g.description_user,
            session.user.id,
          ).toString(CryptoJS.enc.Utf8);
          return { ...g, amount, description_user: desc };
        } catch (e) {
          return { ...g, amount: "0", description_user: "Error de cifrado" };
        }
      });
      setPapelera(decrypted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id) {
    const { error } = await supabase
      .from("gastos")
      .update({ deleted_at: null })
      .eq("id", id);
    if (!error) {
      fetchTrash();
      alert("Restaurado ✅");
    }
  }

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <>
      <Navbar />
      <div className="papelera-page">
        <header className="papelera-header">
          <h1>
            Papelera Reciente{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-trash-off"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="m3 3 18 18M4 7h3m4 0h9M10 11v6M14 14v3M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l.077-.923M18.384 14.373 19 7M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </h1>
          <p>Los elementos se eliminan permanentemente tras 5 días.</p>
        </header>

        <div className="papelera-grid">
          {papelera.length === 0 ? (
            <p className="empty-msg">La papelera está vacía.</p>
          ) : (
            papelera.map((g) => (
              <article className="papelera-item" key={g.id}>
                <div className="item-main">
                  <span className="item-date">
                    Eliminado:{" "}
                    {g.deleted_at?.replace("T", " ").slice(0, 16) ||
                      "Procesando..."}
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
