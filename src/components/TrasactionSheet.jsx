import React, { useEffect } from "react";
import "../styles/transaction_sheet.css";

export function TransactionSheet({
  show,
  onClose,
  type,
  setType,
  monto,
  setMonto,
  descripcion,
  setDescripcion,
  categoria,
  setCategoria,
  reiniciarCiclo,
  setReiniciarCiclo,
  onSave,
  CATEGORY_COLORS,
}) {
  // 1. REGLA DE HOOKS: Todos los useEffect arriba
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  useEffect(() => {
    if (type === "ingreso") {
      setCategoria("Ingreso");
    } else if (type === "ahorro") {
      setCategoria("Ahorro");
      setReiniciarCiclo(false);
    } else {
      // Si el estado es "Ingreso" o "Ahorro" pero cambiamos a gasto, reseteamos
      if (categoria === "Ingreso" || categoria === "Ahorro") {
        setCategoria("Otros");
      }
      setReiniciarCiclo(false);
    }
  }, [type]);

  // 2. Control de renderizado
  if (!show) return null;

  return (
    <div className="full-screen-overlay">
      <div className={`full-screen-container ${type}`}>
        {/* CABECERA ESTILO APP NATIVA */}
        <header className="full-screen-header">
          <h2>Nuevo Movimiento</h2>
          <button className="close-btn" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="header-spacer"></div>
        </header>

        {/* CUERPO CON SCROLL INDEPENDIENTE */}
        <div className="full-screen-body">
          {/* SELECTOR DE TIPO (PILLS) */}
          <div className="type-selector-pills-modern">
            {["gasto", "ingreso", "ahorro"].map((t) => (
              <button
                key={t}
                className={`pill-btn ${type} ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="form-content">
            {/* INPUT DE MONTO */}
            <div className="input-block">
              <label>Monto</label>
              <div className="monto-input-wrapper">
                <span className="symbol">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            {/* INPUT DE DESCRIPCIÓN */}
            <div className="input-block">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="¿En qué se usó el dinero?"
                maxLength={60}
              />
              <span className="char-count">{descripcion.length}/60</span>
            </div>

            {/* SELECT DE CATEGORÍA */}
            <div className="input-block">
              <label>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                disabled={type !== "gasto"}
                style={{
                  borderLeft: `6px solid ${CATEGORY_COLORS[categoria] || "#334155"}`,
                }}
              >
                {type === "gasto" ? (
                  Object.keys(CATEGORY_COLORS)
                    .filter((c) => c !== "Ingreso" && c !== "Ahorro")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                ) : (
                  <option value={type === "ingreso" ? "Ingreso" : "Ahorro"}>
                    {type === "ingreso" ? "📥 Ingreso" : "🔒 Ahorro"}
                  </option>
                )}
              </select>
              {/* {type !== "gasto" && (
                <span className="helper-text">
                  🚨 Los {type}s se asignan automáticamente.
                </span>
              )} */}
              {type == "ingreso" && (
                <span className="helper-text">
                  🚨 Estos movimientos siempre quedan en la categoria Ingreso.
                </span>
              )}
            </div>

            {/* OPCIÓN DE CICLO (SOLO INGRESO) */}
            {type === "ingreso" && (
              <div className="special-card-modern">
                <div className="info">
                  <strong>Iniciar Nuevo Ciclo 🚀</strong>
                  <span>¿Este ingreso resetea tu mes?</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={reiniciarCiclo}
                    onChange={(e) => setReiniciarCiclo(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN FIJO AL FINAL */}
        <footer className="full-screen-footer">
          <button className="btn-main-save" onClick={onSave}>
            Registrar {type}
          </button>
        </footer>
      </div>
    </div>
  );
}
