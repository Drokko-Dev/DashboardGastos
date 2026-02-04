import React from "react";
import { useEffect } from "react";
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
  React.useEffect(() => {
    if (type === "ingreso") setCategoria("Ingreso");
    if (type === "ahorro") setCategoria("Ahorro");
  }, [type]);

  useEffect(() => {
    if (show) {
      // Bloquea el scroll del fondo
      document.body.style.overflow = "hidden";
    } else {
      // Lo libera al cerrar
      document.body.style.overflow = "unset";
    }
    // Limpieza por si el componente se desmonta de golpe
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className={`bottom-sheet-content ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Indicador de arrastre (Visual) */}
        <div className="sheet-handle" onClick={onClose} />

        <div className="sheet-header">
          <div className="type-selector-pills">
            {["gasto", "ingreso", "ahorro"].map((t) => (
              <button
                key={t}
                className={`pill-btn ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-body">
          {/* Input de Monto Estilo Fintech */}
          <div className="monto-display">
            <span className="currency">$</span>
            <input
              type="number"
              inputMode="decimal"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="¿En qué se usó?"
              maxLength={60}
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

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={type !== "gasto"}
              style={{
                borderLeft: `5px solid ${CATEGORY_COLORS[categoria] || "#334155"}`,
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
            {type === "gasto" ? (
              <span style={{ color: "#f87171", fontSize: "0.8rem" }}>
                🚨Solo se puede seleccionar 1 Categoria!
              </span>
            ) : (
              ""
            )}
          </div>

          {/* Opción de Ciclo solo para Ingresos */}
          {type === "ingreso" && (
            <>
              <span style={{ color: "#f87171", fontSize: "0.8rem" }}>
                🚨Este movimiento siempre queda en la categoria Ingreso!
              </span>
              <div className="cycle-option-card">
                <div className="text">
                  <strong>Iniciar Nuevo Ciclo</strong>
                  <p>¿Este ingreso resetea tu mes financiero?</p>
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
            </>
          )}
        </div>

        <div className="sheet-footer">
          <button className="btn-confirm" onClick={onSave}>
            Registrar {type}
          </button>
        </div>
      </div>
    </div>
  );
}
