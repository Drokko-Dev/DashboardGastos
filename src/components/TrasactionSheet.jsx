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
  onSave, // Quitamos reiniciarCiclo y setReiniciarCiclo de las props
  CATEGORY_COLORS,
}) {
  // 1. REGLA DE HOOKS: Bloqueo de scroll del fondo
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

  // 2. Sincronización de categorías según el tipo (Limpio)
  useEffect(() => {
    if (type === "ingreso") {
      setCategoria("Ingreso");
    } else if (type === "ahorro") {
      setCategoria("Ahorro");
    } else {
      if (categoria === "Ingreso" || categoria === "Ahorro") {
        setCategoria("Otros");
      }
    }
  }, [type, setCategoria]);

  if (!show) return null;

  return (
    <div className="full-screen-overlay">
      <div className={`full-screen-container ${type}`}>
        {/* CABECERA FIJA */}
        <header className="full-screen-header">
          <div className="header-spacer"></div>
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
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* CUERPO CON SCROLL INDEPENDIENTE */}
        <main className="full-screen-body">
          <div className="type-selector-pills-modern">
            {["gasto", "ingreso", "ahorro"].map((t) => (
              <button
                key={t}
                className={`pill-btn ${t} ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="form-content">
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

            <div className="input-block">
              <label>Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="¿En qué se usó el dinero?"
                maxLength={60}
                rows="2"
              />
              <span className="char-count">{descripcion.length}/60</span>
            </div>

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
            </div>

            {/* La sección "Iniciar Nuevo Ciclo" ha sido eliminada de aquí */}
          </div>
        </main>

        {/* FOOTER FIJO ABAJO */}
        <footer className="full-screen-footer">
          <button className="btn-main-save" onClick={onSave}>
            Registrar {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </footer>
      </div>
    </div>
  );
}
