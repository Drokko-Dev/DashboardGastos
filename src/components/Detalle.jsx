import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Loading } from "./Loading";
import { AddTransactionButton } from "./FloatingActionButton";
import { TransactionSheet } from "./TrasactionSheet";
import { Edit2, Trash2, Calendar } from "lucide-react";

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
  Ahorro: "#00d4ff",
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
    currentCycleId,
    gastosRaw,
    refreshGastos,
    loadingGastos,
    states = {},
    showToast, // Toast global estándar
    refreshUserProfile
  } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("gasto");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Otros");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingGasto, setEditingGasto] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [vistaModo, setVistaModo] = useState(() => {
    return localStorage.getItem("preferencia_vista") || "mes";
  });

  // Filtrado de movimientos
  const movimientosAMostrar = useMemo(() => {
    const soloActivos = gastosRaw.filter((g) => !g.deleted_at);
    if (vistaModo === "mes") {
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();
      return soloActivos.filter((g) => {
        const fechaMov = new Date(g.date);
        return fechaMov.getMonth() === mesActual && fechaMov.getFullYear() === anioActual;
      });
    } else {
      if (!currentCycleId) return soloActivos;
      return soloActivos.filter((g) => g.ciclo_id === currentCycleId);
    }
  }, [gastosRaw, vistaModo, currentCycleId]);

  // Agrupamiento por fecha
  const grupos = useMemo(() => {
    return movimientosAMostrar.reduce((grupos, mov) => {
      const fechaObj = new Date(mov.date);
      const fechaFormateada = fechaObj.toLocaleDateString("es-CL", {
        day: "numeric", month: "long", year: "numeric",
      });
      if (!grupos[fechaFormateada]) {
        grupos[fechaFormateada] = { items: [], subtotal: 0 };
      }
      grupos[fechaFormateada].items.push(mov);
      const montoNum = Number(mov.amount || 0);
      grupos[fechaFormateada].subtotal += mov.type === "ingreso" ? montoNum : -montoNum;
      return grupos;
    }, {});
  }, [movimientosAMostrar]);

  useEffect(() => {
    localStorage.setItem("preferencia_vista", vistaModo);
  }, [vistaModo]);

  // --- ACCIONES ---

  async function handleSave() {
    const montoNumerico = Number(monto);
    if (!descripcion.trim()) return showToast("⚠️ Ingresa una descripción", "error");
    if (!monto || isNaN(montoNumerico) || montoNumerico <= 0) {
      return showToast("⚠️ Monto inválido", "error");
    }

    try {
      const ahora = new Date().toISOString();
      const { error } = await supabase.from("transacciones").insert([{
        user_id: session.user.id,
        ciclo_id: currentCycleId,
        amount: montoNumerico,
        category: categoria,
        description_user: descripcion.trim(),
        type: type,
        origin: "web",
        date: ahora,
        created_at: ahora,
        is_sueldo: false
      }]);

      if (error) throw error;

      showToast("¡Registro guardado! ✅", "success");
      setShowModal(false);
      setMonto("");
      setDescripcion("");
      await refreshGastos();
      if (refreshUserProfile) await refreshUserProfile();
    } catch (err) {
      showToast("Error al guardar", "error");
    }
  }

  async function executeDelete() {
    try {
      const { error } = await supabase
        .from("transacciones")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", selectedId);

      if (error) throw error;
      showToast("Movido a la papelera 🗑️", "success");
      setShowDeleteModal(false);
      await refreshGastos();
    } catch (err) {
      showToast("Error al eliminar", "error");
    }
  }

  const confirmDelete = (id) => {
    console.log("Abriendo modal para ID:", id); // Para debug en consola
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  async function handleUpdate() {
    if (!editingGasto.description_user.trim()) return;
    try {
      const { error } = await supabase
        .from("transacciones")
        .update({
          amount: Number(editingGasto.amount),
          description_user: editingGasto.description_user.trim(),
          category: editingGasto.category,
        })
        .eq("id", editingGasto.id);

      if (error) throw error;
      setEditingGasto(null);
      showToast("¡Actualizado! ✨", "success");
      await refreshGastos();
    } catch (err) {
      showToast("Error al actualizar", "error");
    }
  }

  if (loadingGastos && gastosRaw.length === 0) return <Loading />;

  return (
    <>
      <TransactionSheet
        show={showModal}
        onClose={() => setShowModal(false)}
        type={type} setType={setType}
        monto={monto} setMonto={setMonto}
        descripcion={descripcion} setDescripcion={setDescripcion}
        categoria={categoria} setCategoria={setCategoria}
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
