<div className="input-group">
  <label>Categoría</label>
  <select
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
    disabled={type === "ingreso" || !type}
    style={{
      borderLeft: `6px solid ${CATEGORY_COLORS[categoria] || "#2e2e2e"}`,
      backgroundColor: type === "ingreso" ? "#1a1a1a" : "#2e2e2e",
      cursor: type === "ingreso" ? "not-allowed" : "pointer",
      opacity: type === "ingreso" ? 0.6 : 1,
    }}
  >
    {Object.keys(CATEGORY_COLORS).map((cat) => (
      <option key={cat} value={cat}>
        {cat === "Otros" ? "░ " : "● "} {cat}
      </option>
    ))}
  </select>

  {/* MENSAJE DE AYUDA: Va aquí abajo */}
  {type === "ingreso" && (
    <span
      style={{
        fontSize: "11px",
        color: "#22c55e",
        marginTop: "4px",
        display: "block",
        fontWeight: "500",
      }}
    >
      * Los ingresos se categorizan automáticamente
    </span>
  )}
</div>;
