import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navbar } from "./Navbar";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto global
import { Link } from "react-router-dom";

export function Detalle() {
  const { session } = useAuth(); // Obtenemos la sesión sin lógica extra

  // Estados simplificados
  const [gastosRaw, setGastosRaw] = useState([]);
  const [nickname, setNickname] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      checkUserLink();
    }
  }, [session]);

  async function checkUserLink() {
    setLoading(true);
    try {
      // 1. Buscamos el perfil (usamos maybeSingle para evitar bloqueos)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id_telegram")
        .eq("auth_id", session.user.id)
        .maybeSingle();

      if (profile?.id_telegram) {
        // 2. Buscamos el nombre del usuario
        const { data: userData } = await supabase
          .from("users")
          .select("full_name, role")
          .eq("id_telegram", profile.id_telegram)
          .maybeSingle();

        if (userData) {
          setNickname(userData.full_name);
          setRole(userData.role);
        }

        // 3. Cargamos los movimientos
        await fetchExpenses();
      }
    } catch (err) {
      console.error("Error en Detalle:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchExpenses() {
    const { data: gastos, error } = await supabase
      .from("gastos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && gastos) {
      setGastosRaw(gastos);
    }
  }

  if (loading)
    return (
      <div className="loading-container">
        <h1>FinanceTracker</h1>
        <h2>Cargando movimientos...</h2>
      </div>
    );

  return (
    <>
      <Navbar nickname={nickname} session={session} role={role} />
      <div className="resumen-container">
        <section className="tickets">
          <div className="tickets-header">
            <h1 className="tituloGastos">Detalle de Movimientos</h1>
            <Link to="/">
              <button className="tickets-detalle">Inicio</button>
            </Link>
          </div>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoria</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticket">
            {gastosRaw.map((g, i) => (
              <article className="ticket-card" key={g.id}>
                <p className="fecha-registro">
                  {g.created_at.replace("T", " ").slice(0, 16)}
                </p>
                <p>{g.description_ia_bot || "Sin descripción"}</p>
                <h2 className="category">{g.category || "GENERAL"}</h2>
                <span
                  style={{ color: g.type === "gasto" ? "#ef4444" : "#36d35d" }}
                >
                  ${Number(g.amount || g.monto).toLocaleString("es-CL")}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
