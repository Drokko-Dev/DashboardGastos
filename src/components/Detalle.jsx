import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navbar } from "./Navbar";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto global
import { Link } from "react-router-dom";
import { Loading } from "./Loading";
import { AddTransactionButton } from "./FloatingActionButton";
import { TransactionSheet } from "./TrasactionSheet";

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
  Ahorro: "#00d4ff", // Un cian eléctrico para resaltar el ahorro
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
const btnEditeSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
    <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415M16 5l3 3" />
  </svg>
);

export function Detalle() {
  const {
    session,
    fullName,
    role,
    currentCycleId,
    idTelegram,
    gastosRaw,
    refreshGastos,
    loadingGastos,
    states = {},
  } = useAuth();

  // Estados locales de UI
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("gasto");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Otros");
  const [reiniciarCiclo, setReiniciarCiclo] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingGasto, setEditingGasto] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  /* const { vistaModo, setVistaModo } = useAuth(); */
  const [vistaModo, setVistaModo] = useState(() => {
    return localStorage.getItem("preferencia_vista") || "mes";
  });

  // 1. LÓGICA DE FILTRADO REACTIVA
  const movimientosAMostrar = useMemo(() => {
    // Primero, filtramos SOLO los que NO están eliminados
    const soloActivos = gastosRaw.filter((g) => !g.deleted_at);

    if (vistaModo === "mes") {
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();

      return soloActivos.filter((g) => {
        const fechaMov = new Date(g.date);
        return (
          fechaMov.getMonth() === mesActual &&
          fechaMov.getFullYear() === anioActual
        );
      });
    } else {
      // Para el modo ciclo
      if (!currentCycleId) return soloActivos;
      return soloActivos.filter((g) => g.ciclo_id === currentCycleId);
    }
  }, [gastosRaw, vistaModo, currentCycleId]);

  // 2. LÓGICA DE AGRUPAMIENTO REACTIVA
  const grupos = useMemo(() => {
    return movimientosAMostrar.reduce((grupos, mov) => {
      // 1. Convertimos el ISO almacenado a un objeto Date (esto ya considera Chile)
      const fechaObj = new Date(mov.date);

      // 2. Creamos el encabezado (Ej: "20 de mayo de 2024")
      const fechaFormateada = fechaObj.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!grupos[fechaFormateada]) {
        grupos[fechaFormateada] = { items: [], subtotal: 0 };
      }

      grupos[fechaFormateada].items.push(mov);

      const montoNum = Number(mov.amount || 0);
      // Sumamos si es ingreso, restamos si es gasto o ahorro
      grupos[fechaFormateada].subtotal +=
        mov.type === "ingreso" ? montoNum : -montoNum;

      return grupos;
    }, {});
  }, [movimientosAMostrar]);

  // Forzar categoría "Ingreso" si el tipo es ingreso
  useEffect(() => {
    if (type === "ingreso") {
      setCategoria("Ingreso");
    } else if (type === "ahorro") {
      setCategoria("Ahorro");
      setReiniciarCiclo(false);
    } else {
      // Si es gasto, reseteamos a Otros o lo dejamos libre
      setCategoria("Otros");
      setReiniciarCiclo(false);
    }
  }, [type]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("preferencia_vista", vistaModo);
  }, [vistaModo]);

  // --- 1. FUNCIÓN PARA GUARDAR (Adaptada a Multi-usuario y tabla 'transacciones') ---
  async function handleSave() {
    if (!type) return alert("Selecciona Gasto o Ingreso");
    if (!descripcion) return alert("Falta la descripción");
    const montoNumerico = Number(monto);

    if (!monto || isNaN(montoNumerico) || montoNumerico <= 0) {
      setToast({ show: true, message: "⚠️ Monto inválido", type: "error" });
      return;
    }

    try {
      // Usamos el id de la sesión para obtener el perfil actualizado
      const { data: profile, error: errorProf } = await supabase
        .from("profiles")
        .select("id, current_cycle_id, telegram_id")
        .eq("id", session.user.id)
        .single();

      if (errorProf) throw errorProf;

      const ahora = new Date();
      const createdAtISO = ahora.toISOString();
      const fechaSQL = ahora.toLocaleDateString("en-CA");

      let cicloIdFinal = profile.current_cycle_id;

      // --- LÓGICA DE REINICIO DE CICLO (v1.1.2) ---
      if (type === "ingreso" && reiniciarCiclo) {
        // Usamos el timestamp completo para precisión en Chile
        const ahoraISO = new Date().toISOString();

        if (profile.current_cycle_id) {
          // 1. Cerramos el ciclo anterior usando los nombres de columna correctos
          await supabase
            .from("ciclos")
            .update({
              is_active: false, // Antes era 'estado'
              end_date: ahoraISO, // Antes era 'fecha_fin'
            })
            .eq("id", profile.current_cycle_id);
        }

        // 2. Insertamos el nuevo ciclo con tus columnas: name, start_date, budget, is_active
        const { data: nuevoCiclo, error: errC } = await supabase
          .from("ciclos")
          .insert([
            {
              user_id: profile.id,
              name: descripcion.trim(), // Antes era 'nombre'
              budget: montoNumerico, // Antes era 'monto_inicial'
              start_date: ahoraISO, // Antes era 'fecha_inicio'
              is_active: true, // Antes era 'estado'
            },
          ])
          .select()
          .single();

        if (errC) throw errC;
        cicloIdFinal = nuevoCiclo.id;

        // 3. Actualizamos el puntero en el perfil
        await supabase
          .from("profiles")
          .update({ current_cycle_id: cicloIdFinal })
          .eq("id", profile.id);
      }

      // INSERTAR EN LA TABLA 'transacciones'
      const { error: errG } = await supabase
        .from("transacciones") // <--- TABLA ACTUALIZADA
        .insert([
          {
            user_id: profile.id, // Dueño del registro
            ciclo_id: cicloIdFinal,
            amount: montoNumerico,
            category: categoria,
            description_user: descripcion.trim(),
            type: type,
            origin: "web",
            id_telegram: profile.telegram_id,
            date: createdAtISO,
            created_at: createdAtISO,
            is_sueldo: type === "ingreso" && reiniciarCiclo,
          },
        ]);

      if (errG) throw errG;

      setToast({
        show: true,
        message: reiniciarCiclo ? "¡Ciclo Reiniciado! 🚀" : "¡Guardado! ✅",
        type: "success",
      });
      setTimeout(() => setToast({ show: false }), 3000);
      setShowModal(false);
      setMonto("");
      setDescripcion("");
      setReiniciarCiclo(false);
      await refreshGastos();
    } catch (err) {
      console.error("Error:", err);
      setToast({ show: true, message: "Error: " + err.message, type: "error" });
      setTimeout(() => setToast({ show: false }), 3000);
    }
  }
  const confirmDelete = (id) => {
    console.log("Abriendo modal para ID:", id); // Para debug en consola
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // --- 2. FUNCIÓN PARA ELIMINAR (Soft Delete en 'transacciones') ---
  async function executeDelete() {
    try {
      const ahora = new Date();
      const deletedAtISO = ahora.toISOString();

      const { error } = await supabase
        .from("transacciones") // <--- TABLA ACTUALIZADA
        .update({ deleted_at: deletedAtISO })
        .eq("id", selectedId)
        .eq("user_id", session.user.id); // Seguridad: Solo el dueño borra

      if (error) throw error;

      setToast({
        show: true,
        message: "Movido a la papelera 🗑️",
        type: "success",
      });
      setTimeout(() => setToast({ show: false }), 3000);
      setShowDeleteModal(false);
      await refreshGastos();
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Error al eliminar", type: "error" });
      setTimeout(() => setToast({ show: false }), 3000);
    }
  }

  // --- 3. FUNCIÓN PARA ACTUALIZAR (En 'transacciones') ---
  async function handleUpdate() {
    if (!editingGasto.description_user.trim()) return;
    const montoNumerico = Number(editingGasto.amount);

    try {
      const { error } = await supabase
        .from("transacciones") // <--- TABLA ACTUALIZADA
        .update({
          amount: montoNumerico,
          description_user: editingGasto.description_user.trim(),
          category: editingGasto.category,
        })
        .eq("id", editingGasto.id)
        .eq("user_id", session.user.id); // Seguridad

      if (error) throw error;

      setEditingGasto(null);
      setToast({ show: true, message: "¡Actualizado! ✨", type: "success" });
      setTimeout(() => setToast({ show: false }), 3000);
      await refreshGastos();
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Error al actualizar", type: "error" });
      setTimeout(() => setToast({ show: false }), 3000);
    }
  }

  if (loadingGastos && gastosRaw.length === 0) return <Loading />;

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

      <TransactionSheet
        show={showModal}
        onClose={() => setShowModal(false)}
        type={type}
        setType={setType}
        monto={monto}
        setMonto={setMonto}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        categoria={categoria}
        setCategoria={setCategoria}
        reiniciarCiclo={reiniciarCiclo}
        setReiniciarCiclo={setReiniciarCiclo}
        onSave={handleSave}
        CATEGORY_COLORS={CATEGORY_COLORS}
      />
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
      {/* MODAL para modificar */}
      {editingGasto && (
        <div className="modal-overlay">
          <div
            className={`modal-content ${editingGasto.type === "gasto" ? "gasto" : "ingreso"}`}
          >
            <div
              className={`modal-title ${editingGasto.type === "gasto" ? "gasto" : "ingreso"}`}
            >
              <h2>Editar</h2>
              <span>
                {editingGasto.type === "ingreso" ? "Ingreso" : "Gasto"}
              </span>
            </div>

            <div className="input-group">
              <label style={{ fontSize: "14px", color: "#94a3b8" }}>
                Monto ($)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={Math.abs(editingGasto.amount)} // Mostramos valor absoluto para editar
                onChange={(e) =>
                  setEditingGasto({
                    ...editingGasto,
                    amount:
                      editingGasto.amount < 0
                        ? -Math.abs(e.target.value)
                        : Math.abs(e.target.value),
                  })
                }
              />
            </div>

            <div className="input-group">
              <label style={{ fontSize: "14px", color: "#94a3b8" }}>
                Descripción
              </label>
              <textarea
                className="input-description"
                value={editingGasto.description_user}
                onChange={(e) =>
                  setEditingGasto({
                    ...editingGasto,
                    description_user: e.target.value,
                  })
                }
                maxLength={60}
                rows="2"
                style={{ resize: "none" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  color: "#94a3b8",
                }}
              >
                {editingGasto.description_user.length}/60
              </span>
            </div>

            <div className="input-group">
              <label style={{ fontSize: "14px", color: "#94a3b8" }}>
                Categoría
              </label>
              <select
                value={editingGasto.category}
                onChange={(e) =>
                  setEditingGasto({ ...editingGasto, category: e.target.value })
                }
                disabled={editingGasto.category === "Ingreso"}
                style={{
                  opacity: editingGasto.category === "Ingreso" ? 0.6 : 1,
                  backgroundColor:
                    editingGasto.category === "Ingreso" ? "#1a1a1a" : "#2e2e2e",
                }}
              >
                {editingGasto.category === "Ingreso" ? (
                  <option value="Ingreso">Ingreso</option>
                ) : (
                  Object.keys(CATEGORY_COLORS)
                    .filter((cat) => cat !== "Ingreso")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                )}
              </select>
            </div>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button onClick={handleUpdate} className="btn-save">
                Actualizar
              </button>
              <button
                onClick={() => setEditingGasto(null)}
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <Navbar /> */}
      <div className="resumen-container">
        <div className="view-selector-bi">
          <button
            className={`selector-pill ${vistaModo === "mes" ? "active" : ""}`}
            onClick={() => setVistaModo("mes")}
          >
            Mes Actual
          </button>
          <button
            className={`selector-pill ${vistaModo === "ciclo" ? "active" : ""}`}
            onClick={() => setVistaModo("ciclo")}
          >
            Ciclo Activo
          </button>
        </div>
        <section className="tickets tickets-detalle">
          <div className="tickets-header">
            <h1 className="tituloGastos">Todos los Movimientos</h1>
            <div className="tickets-buttons">
              <AddTransactionButton onClick={() => setShowModal(true)} />
              {/* <Link to="/">
                <button className="tickets-button btn-detalle">Inicio</button>
              </Link> */}
            </div>
          </div>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoría</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticketDetalle">
            {Object.entries(grupos).map(([fecha, data]) => (
              <div key={fecha} className="grupo-dia-contenedor">
                {/* SEPARADOR DE FECHA TIPO BANCA */}
                {isMobile ? (
                  <div className="fecha-separador-header">
                    <span className="fecha-texto-label">{fecha}</span>
                  </div>
                ) : (
                  <div className="fecha-separador-header">
                    <span className="fecha-texto-label">{fecha}</span>
                    <span
                      className={`fecha-subtotal-label ${data.subtotal >= 0 ? "positivo" : "negativo"}`}
                    >
                      {data.subtotal >= 0 ? "+" : "-"}$
                      {Math.abs(data.subtotal).toLocaleString("es-CL")}
                    </span>
                  </div>
                )}

                <div className="lista-items-dia">
                  {data.items.map((g) => {
                    const isHidden =
                      (g.type === "ingreso" && states?.ingreso) ||
                      (g.type === "gasto" && states?.gasto);
                    const categoriaColor =
                      CATEGORY_COLORS[g.category] || "#94a3b8";
                    const getMontoColor = (type) => {
                      if (type === "ahorro") return "#00d4ff"; // Color cian para ahorro
                      if (type === "gasto") return "#ef4444"; // Rojo para gasto
                      return "#36d35d"; // Verde para ingreso
                    };
                    const fechaObjeto = new Date(g.date);
                    const horaChile = fechaObjeto.toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });

                    return (
                      <article className="ticket-card" key={g.id}>
                        {/* BOTONES DE ACCIÓN */}
                        <button
                          onClick={() => confirmDelete(g.id)}
                          className="btn-delete-card"
                          title="Eliminar"
                        >
                          {btnDeleteSVG}
                        </button>
                        <button
                          onClick={() => setEditingGasto(g)}
                          className="btn-edit"
                        >
                          {btnEditeSVG}
                        </button>

                        {/* HORA DEL REGISTRO */}
                        <p className="fecha-registro">{horaChile} hrs</p>

                        <p className="descripcion-texto">
                          {g.description_user || "Sin descripción"}
                        </p>

                        {/* APLICACIÓN DE COLORES DINÁMICOS */}
                        {isMobile ? (
                          <div className="monto-categoria">
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
                              className={isHidden ? "monto-blurred" : ""}
                              style={{
                                color: getMontoColor(g.type),
                                transition: "all 0.3s ease", // Transición suave para el efecto premium
                              }}
                            >
                              {g.type === "gasto"
                                ? `-$${Number(g.amount || g.monto).toLocaleString("es-CL")}`
                                : `$${Number(g.amount || g.monto).toLocaleString("es-CL")}`}
                            </span>
                          </div>
                        ) : (
                          <>
                            <h2
                              className={`category ${g.category}`}
                              style={
                                g.category === "Ahorro"
                                  ? {}
                                  : {
                                      color: `${categoriaColor}`,
                                      opacity: 0.85,
                                      borderColor: categoriaColor,
                                      backgroundColor: `${categoriaColor}25`, // 15 añade un 8% de opacidad para el fondo
                                    }
                              }
                            >
                              {g.category || "GENERAL"}
                            </h2>

                            <span
                              className={isHidden ? "monto-blurred" : ""}
                              style={{
                                color: getMontoColor(g.type),
                                transition: "all 0.3s ease", // Transición suave para el efecto premium
                              }}
                            >
                              {g.type === "gasto"
                                ? `-$${Number(g.amount || g.monto).toLocaleString("es-CL")}`
                                : `$${Number(g.amount || g.monto).toLocaleString("es-CL")}`}
                            </span>
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
