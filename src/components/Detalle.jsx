import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navbar } from "./Navbar";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto global
import { Link } from "react-router-dom";
import { Loading } from "./Loading";
import { AddTransactionButton } from "./FloatingActionButton";

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
};

const btnDeleteSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
    className="icon icon-tabler icons-tabler-filled icon-tabler-square-rounded-x"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="m12 2 .324.001.318.004.616.017.299.013.579.034.553.046c4.785.464 6.732 2.411 7.196 7.196l.046.553.034.579c.005.098.01.198.013.299l.017.616L22 12l-.005.642-.017.616-.013.299-.034.579-.046.553c-.464 4.785-2.411 6.732-7.196 7.196l-.553.046-.579.034c-.098.005-.198.01-.299.013l-.616.017L12 22l-.642-.005-.616-.017-.299-.013-.579-.034-.553-.046c-4.785-.464-6.732-2.411-7.196-7.196l-.046-.553-.034-.579a28.058 28.058 0 0 1-.013-.299l-.017-.616C2.002 12.432 2 12.218 2 12l.001-.324.004-.318.017-.616.013-.299.034-.579.046-.553c.464-4.785 2.411-6.732 7.196-7.196l.553-.046.579-.034c.098-.005.198-.01.299-.013l.616-.017c.21-.003.424-.005.642-.005zm-1.489 7.14a1 1 0 0 0-1.218 1.567L10.585 12l-1.292 1.293-.083.094a1 1 0 0 0 1.497 1.32L12 13.415l1.293 1.292.094.083a1 1 0 0 0 1.32-1.497L13.415 12l1.292-1.293.083-.094a1 1 0 0 0-1.497-1.32L12 10.585l-1.293-1.292-.094-.083z" />
  </svg>
);

export function Detalle() {
  const { session } = useAuth(); // Obtenemos la sesión sin lógica extra

  // Estados simplificados
  const [gastosRaw, setGastosRaw] = useState([]);
  const [nickname, setNickname] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estados para Modal Crear Movimiento
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("gasto"); // "gasto" o "ingreso"
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Otros");
  const [toast, setToast] = useState({ show: false, message: "" });
  //Estados para Eliminar datos
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (session?.user) {
      checkUserLink();
    }
  }, [session]);

  // Forzar categoría "Ingreso" si el tipo es ingreso
  useEffect(() => {
    if (type === "ingreso") {
      setCategoria("Ingreso");
    } else if (type === "gasto" && categoria === "Ingreso") {
      // Si vuelve a gasto, lo reseteamos a Otros para evitar errores
      setCategoria("Otros");
    }
  }, [type]);

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

  //Funcion para insertar datos en la base
  async function handleSave() {
    if (!type) return alert("Selecciona Gasto o Ingreso");
    if (!descripcion) return alert("Falta la descripción");
    const montoNumerico = Number(monto);
    if (!monto || isNaN(montoNumerico) || montoNumerico <= 0) {
      setToast({
        show: true,
        message: "⚠️ El monto debe ser un número válido",
        type: "error",
      });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }

    // Obtenemos id_telegram del perfil cargado previamente
    const { data: profile } = await supabase
      .from("profiles")
      .select("id_telegram")
      .eq("auth_id", session.user.id)
      .single();

    const ahora = new Date();

    // Extraemos los datos según la hora local del usuario
    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1; // Enero es 0
    const anio = ahora.getFullYear();
    // Formato YYYY-MM-DD para la columna 'date'
    const fechaLocal = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    // Formato para created_at (incluyendo la hora local)
    const createdAtLocal = ahora.toLocaleString("sv-SE").replace(" ", "T");
    // 'sv-SE' genera YYYY-MM-DD HH:mm:ss que es compatible con Supabase
    const descripcionFinal =
      descripcion.trim().length > 60
        ? descripcion.trim().substring(0, 57) + "..."
        : descripcion.trim();
    try {
      const { error } = await supabase.from("gastos").insert([
        {
          origin: "web",
          amount: Number(monto),
          description_user: descripcionFinal, // Lo que escribes en el modal
          description_telegram: descripcionFinal,
          category: categoria,
          type: type,
          id_telegram: profile?.id_telegram, // Vínculo esencial
          user: nickname, // Tu nombre
          // Campos de tiempo para tu análisis de BI
          date: fechaLocal,
          day: dia,
          month: mes,
          year: anio,
          created_at: createdAtLocal,
        },
      ]);

      if (error) throw error;

      setShowModal(false);
      setToast({
        show: true,
        message: "¡Movimiento guardado con éxito! ✅",
        type: "success",
      });
      // Limpiamos estados
      setMonto("");
      setDescripcion("");
      setType(null);
      fetchExpenses(); // Refresca la tabla automáticamente

      // Desaparece después de 3 segundos
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
    } catch (err) {
      console.error("Error completo:", err);
      alert("No se pudo guardar el movimiento");
    }
  }

  //Funcion para Eliminar datos de la base

  // Paso 1: Abrir el modal y guardar el ID
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // Paso 2: Ejecutar la eliminación real
  async function executeDelete() {
    try {
      const { error } = await supabase
        .from("gastos")
        .delete()
        .eq("id", selectedId);

      if (error) throw error;

      setToast({
        show: true,
        message: "Movimiento eliminado 🗑️",
        type: "success",
      });
      setShowDeleteModal(false);
      fetchExpenses();
    } catch (err) {
      setToast({ show: true, message: "Error al eliminar ❌", type: "error" });
    } finally {
      setTimeout(() => setToast({ show: false }), 3000);
    }
  }

  if (loading) return <Loading />;

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

      {showModal && (
        <div className="modal-overlay">
          <div
            className={
              type === "gasto" ? `modal-content gasto` : `modal-content ingreso`
            }
          >
            <div
              className={
                type === "gasto" ? `modal-title gasto` : `modal-title ingreso`
              }
            >
              <h2>Nuevo</h2>
              <span>{type === "gasto" ? "Gasto" : "Ingreso"}</span>
            </div>
            <div className="type-selector">
              <button
                type="button"
                className={`selector-btn gasto ${type === "gasto" ? "active" : ""}`}
                onClick={() => setType("gasto")}
              >
                Gasto
              </button>
              <button
                type="button"
                className={`selector-btn ingreso ${type === "ingreso" ? "active" : ""}`}
                onClick={() => setType("ingreso")}
              >
                Ingreso
              </button>
            </div>
            <input
              type="number"
              inputMode="numeric" // Esto fuerza el teclado numérico en móviles
              placeholder="Monto ($)"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className={isNaN(Number(monto)) ? "input-error" : ""}
            />
            <div className="input-group">
              <textarea
                placeholder="Descripción detallada..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="2" // Esto lo hace visualmente más largo hacia abajo
                className="input-description"
                maxLength={60} // Un límite razonable para tus reportes
                style={{ resize: "none" }} // Evita que el usuario lo deforme manualmente
              />
              <span
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  display: "block",
                  color: "#94a3b8",
                }}
              >
                {descripcion.length}/60
              </span>
            </div>
            <div className="input-group">
              <label>Categoría</label>
              <select
                value={type === "ingreso" ? "Ingreso" : categoria}
                onChange={(e) => setCategoria(e.target.value)}
                disabled={type === "ingreso" || !type}
                style={{
                  borderLeft: `6px solid ${CATEGORY_COLORS[categoria] || "#2e2e2e"}`,
                  backgroundColor: type === "ingreso" ? "#1a1a1a" : "#2e2e2e",
                  cursor: type === "ingreso" ? "not-allowed" : "pointer",
                  opacity: type === "ingreso" ? 0.6 : 1,
                }}
              >
                {type === "ingreso" ? (
                  // Si es ingreso, solo renderizamos UNA opción: Ingreso
                  <option value="Ingreso">Ingreso</option>
                ) : (
                  // Si es gasto, mapeamos todas las categorías de tu objeto
                  Object.keys(CATEGORY_COLORS)
                    .filter((cat) => cat !== "Ingreso") // Filtramos para que no salga 'Ingreso' en gastos
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                )}
              </select>

              {/* MENSAJE DE AYUDA: Va aquí abajo */}
              {type === "ingreso" ? (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#c52222",
                    marginTop: "4px",
                    display: "block",
                    fontWeight: "500",
                  }}
                >
                  🚨Los ingresos quedan en la categoria Ingreso!
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "13px",
                    color: "#c52222",
                    marginTop: "4px",
                    display: "block",
                    fontWeight: "500",
                  }}
                >
                  🚨Solo se puede seleccionar 1 Categoria!
                </span>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={handleSave} className="btn-save">
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm">
            <div className="modal-icon-warning">⚠️</div>
            <h2 className="modal-title-delete">¿Eliminar registro?</h2>
            <p>
              Esta acción no se puede deshacer y afectará tus reportes
              mensuales.
            </p>

            <div className="modal-actions-horizontal">
              <button onClick={executeDelete} className="btn-confirm-delete">
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-cancel-modal"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar nickname={nickname} session={session} role={role} />
      <div className="resumen-container">
        <section className="tickets">
          <div className="tickets-header">
            <h1 className="tituloGastos">Todos los Movimientos</h1>
            <div className="tickets-buttons">
              <AddTransactionButton onClick={() => setShowModal(true)} />
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
          <div className="ticketDetalle">
            {gastosRaw.map((g, i) => {
              // Obtenemos el color dinámico. Si no existe, usamos un gris por defecto.
              const categoriaColor = CATEGORY_COLORS[g.category] || "#94a3b8";

              return (
                <article className="ticket-card" key={g.id}>
                  <button
                    onClick={() => confirmDelete(g.id)}
                    className="btn-delete-card"
                    title="Eliminar"
                  >
                    {btnDeleteSVG}
                  </button>

                  <p className="fecha-registro">
                    {g.created_at.replace("T", " ").slice(0, 16)}
                  </p>
                  <p className="descripcion-texto">
                    {g.description_user || "Sin descripción"}
                  </p>

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
