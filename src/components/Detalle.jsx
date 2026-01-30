import { useEffect, useState, useMemo } from "react";
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
    nickname,
    role,
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
    if (vistaModo === "mes") {
      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();
      return gastosRaw.filter(
        (g) => g.month === mesActual && g.year === anioActual,
      );
    } else {
      // Filtrar por ciclo: Buscamos el registro marcado como sueldo
      const ultimoSueldo = gastosRaw.find((g) => g.is_sueldo === true);
      if (!ultimoSueldo) return gastosRaw;
      return gastosRaw.filter(
        (g) =>
          new Date(g.created_at).getTime() >=
          new Date(ultimoSueldo.created_at).getTime(),
      );
    }
  }, [gastosRaw, vistaModo]);

  // 2. LÓGICA DE AGRUPAMIENTO REACTIVA
  const grupos = useMemo(() => {
    return movimientosAMostrar.reduce((grupos, mov) => {
      // Extraemos la fecha directamente del string YYYY-MM-DD para evitar el desfase de horas
      // Esto asegura que si en la base dice 30, el encabezado diga 30
      const [year, month, day] = mov.created_at.split("T")[0].split("-");
      const fechaObj = new Date(year, month - 1, day); // Meses en JS son 0-11

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
      grupos[fechaFormateada].subtotal +=
        mov.type === "ingreso" ? montoNum : -montoNum;

      return grupos;
    }, {});
  }, [movimientosAMostrar]);

  // Forzar categoría "Ingreso" si el tipo es ingreso
  useEffect(() => {
    if (type === "ingreso") setCategoria("Ingreso");
    else {
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

  async function fetchExpenses() {
    const { data: gastos, error } = await supabase
      .from("gastos")
      .select("*")
      .is("deleted_at", null) // Solo traemos los que NO están eliminados
      .order("created_at", { ascending: false });

    if (!error && gastos) {
      setGastosRaw(gastos);
    }
  }

  // Funcion para insertar datos en la base
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

    try {
      // 1. EXTRAEMOS DATOS DEL CONTEXTO (idTelegram viene de useAuth)
      // Primero validamos el ciclo actual del perfil en tiempo real para seguridad
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_cycle_id")
        .eq("id_telegram", idTelegram) // idTelegram ya lo tenemos global
        .single();

      const ahora = new Date();
      const createdAtLocal = ahora.toLocaleString("sv-SE").replace(" ", "T");
      const descripcionFinal =
        descripcion.trim().length > 60
          ? descripcion.trim().substring(0, 57) + "..."
          : descripcion.trim();

      let cicloIdFinal = profile.current_cycle_id;

      // 2. LÓGICA DE REINICIO DE CICLO (Triple Acción de BI)
      if (type === "ingreso" && reiniciarCiclo) {
        // A. Cerrar ciclo actual
        await supabase
          .from("ciclos")
          .update({ estado: false, fecha_fin: createdAtLocal })
          .eq("id", profile.current_cycle_id);

        // B. Crear nuevo ciclo y capturar su ID
        const { data: cicloNuevo, error: errorCiclo } = await supabase
          .from("ciclos")
          .insert([
            {
              id_telegram: idTelegram,
              nombre: descripcionFinal,
              estado: true,
              monto_inicial: montoNumerico,
              fecha_inicio: createdAtLocal,
            },
          ])
          .select()
          .single();

        if (errorCiclo) throw errorCiclo;
        cicloIdFinal = cicloNuevo.id;

        // C. Vincular Perfil al Nuevo Ciclo
        await supabase
          .from("profiles")
          .update({ current_cycle_id: cicloIdFinal })
          .eq("id_telegram", idTelegram);
      }

      // 3. INSERTAR EL MOVIMIENTO FINAL
      const { error: errorGasto } = await supabase.from("gastos").insert([
        {
          origin: "web",
          amount: montoNumerico,
          description_user: descripcionFinal,
          description_telegram: descripcionFinal,
          category: categoria,
          type: type,
          id_telegram: idTelegram,
          user: nickname, // Viene del contexto
          date: ahora.toISOString().split("T")[0],
          day: ahora.getDate(),
          month: ahora.getMonth() + 1,
          year: ahora.getFullYear(),
          created_at: createdAtLocal,
          ciclo_id: cicloIdFinal, // Vinculación garantizada
          is_sueldo: type === "ingreso" && reiniciarCiclo,
        },
      ]);

      if (errorGasto) throw errorGasto;

      // 4. FEEDBACK Y REFRESCO GLOBAL
      setShowModal(false);
      setToast({
        show: true,
        message: reiniciarCiclo
          ? "¡Nuevo Ciclo Iniciado! 🚀"
          : "¡Movimiento guardado! ✅",
        type: "success",
      });

      // Reset de estados locales
      setMonto("");
      setDescripcion("");
      setReiniciarCiclo(false);
      setType("gasto");

      // RECARGA INSTANTÁNEA: Actualiza la lista global en el Contexto
      await refreshGastos();

      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } catch (err) {
      console.error("Error completo:", err);
      alert("No se pudo completar la operación");
    }
  }

  //Funcion para Eliminar datos de la base

  // Paso 1: Abrir el modal y guardar el ID
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // Paso 2: Ejecutar el soft delete
  async function executeDelete() {
    try {
      const ahora = new Date();
      const createdAtLocal = ahora.toLocaleString("sv-SE").replace(" ", "T");

      const { error } = await supabase
        .from("gastos")
        .update({ deleted_at: createdAtLocal }) // Marcamos como eliminado
        .eq("id", selectedId);

      if (error) throw error;

      // 1. FEEDBACK VISUAL
      setToast({
        show: true,
        message: "Movimiento movido a la papelera 🗑️",
        type: "success",
      });
      setShowDeleteModal(false);

      // 2. LA CLAVE: Sincronización Global
      // Reemplazamos fetchExpenses() por refreshGastos() del contexto
      await refreshGastos();

      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
    } catch (err) {
      setToast({ show: true, message: "Error al procesar ❌", type: "error" });
      console.error("Error al eliminar:", err);
    }
  }
  // Ejecutar Actualizar
  async function handleUpdate() {
    // 1. Validación de descripción
    if (!editingGasto.description_user.trim()) {
      setToast({
        show: true,
        message: "⚠️ La descripción no puede estar vacía",
        type: "error",
      });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }

    // 2. Validación de monto
    const montoNumerico = Number(editingGasto.amount);
    if (!editingGasto.amount || isNaN(montoNumerico) || montoNumerico === 0) {
      setToast({
        show: true,
        message: "⚠️ Ingresa un monto válido",
        type: "error",
      });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }

    // 3. Procesamiento de texto (Límite de 60 caracteres)
    const descripcionFinal =
      editingGasto.description_user.trim().length > 60
        ? editingGasto.description_user.trim().substring(0, 57) + "..."
        : editingGasto.description_user.trim();

    try {
      // 4. Actualización en Supabase
      const { error } = await supabase
        .from("gastos")
        .update({
          amount: montoNumerico,
          description_user: descripcionFinal,
          description_telegram: descripcionFinal,
          category: editingGasto.category,
        })
        .eq("id", editingGasto.id);

      if (error) throw error;

      // 5. Feedback de éxito
      setEditingGasto(null);
      setToast({
        show: true,
        message: "¡Movimiento actualizado! ✨",
        type: "success",
      });

      // LA CLAVE: Sincronización Global
      // Reemplazamos fetchExpenses() por la función del Contexto
      await refreshGastos();
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({
        show: true,
        message: "❌ Error: No se pudo actualizar el registro",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
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
            {type === "ingreso" && (
              <div
                className="switch-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "10px 0",
                  padding: "10px",
                  background: "#1a1a1a",
                  borderRadius: "8px",
                }}
              >
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={reiniciarCiclo}
                    onChange={(e) => setReiniciarCiclo(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
                <span
                  style={{
                    fontSize: "13px",
                    color: reiniciarCiclo ? "#36d35d" : "#94a3b8",
                  }}
                >
                  {reiniciarCiclo
                    ? "🚀 Iniciar Nuevo Ciclo"
                    : "¿Cerrar ciclo con este ingreso?"}
                </span>
              </div>
            )}
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
                        <p className="fecha-registro">
                          {g.created_at.split("T")[1].slice(0, 5)} hrs
                        </p>

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
                              style={{
                                color:
                                  g.type === "gasto" ? "#ef4444" : "#36d35d",
                              }}
                            >
                              {" "}
                              {g.type === "gasto"
                                ? `-$${Number(g.amount || g.monto).toLocaleString("es-CL")}`
                                : `$${Number(g.amount || g.monto).toLocaleString("es-CL")}`}
                            </span>
                          </div>
                        ) : (
                          <>
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
                                color:
                                  g.type === "gasto" ? "#ef4444" : "#36d35d",
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
