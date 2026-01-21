import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navbar } from "./Navbar";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto global
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

const CATEGORY_COLORS = {
  Alimentos: "#bbd83a",
  Transporte: "#F59E0B",
  Hogar: "#EC4899",
  Salud: "#1fce7c",
  Ocio: "#8B5CF6",
  Mascotas: "#0bc5e6",
  Compras: "#a8dbdb",
  Fijos: "#6366F1",
  Otros: "#697fa193",
  Ingreso: "#22C55E",
};

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

  if (loading) return <Loading />;

  return (
    <>
      <Navbar nickname={nickname} session={session} role={role} />
      <div className="resumen-container">
        <section className="tickets">
          <div className="tickets-header">
            <h1 className="tituloGastos">Detalle de Movimientos</h1>
            <div className="tickets-buttons">
              <button className="tickets-button btn-add">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <Link to="/">
                <button className="tickets-button btn-detalle">Inicio</button>
              </Link>
            </div>
          </div>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoría</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticket">
            {gastosRaw.map((g, i) => {
              // Obtenemos el color dinámico. Si no existe, usamos un gris por defecto.
              const categoriaColor = CATEGORY_COLORS[g.category] || "#94a3b8";

              return (
                <article className="ticket-card" key={g.id}>
                  <p className="fecha-registro">
                    {g.created_at.replace("T", " ").slice(0, 16)}
                  </p>
                  <p>{g.description_ia_bot || "Sin descripción"}</p>

                  {/* APLICACIÓN DE COLORES DINÁMICOS */}
                  <h2
                    className={`category ${g.category}`}
                    style={{
                      color: `${categoriaColor}`,
                      opacity: 0.85,
                      borderColor: categoriaColor,
                      backgroundColor: `${categoriaColor}25`, // 15 añade un 8% de opacidad para el fondo
                    }}
                  >
                    {g.category || "GENERAL"}
                  </h2>

                  <span
                    style={{
                      color: g.type === "gasto" ? "#ef4444" : "#36d35d",
                    }}
                  >
                    ${Number(g.amount || g.monto).toLocaleString("es-CL")}
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
