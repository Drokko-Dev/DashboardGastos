import "../styles/ciclo_banner.css";
export function CicloBanner({ ciclo }) {
  if (!ciclo) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      timeZone: "UTC", // Esto evita que el 28 se convierta en 27
    });
  };

  return (
    <div>
      <div className="resumen-container">
        <div className="ciclo-minimal-wrapper">
          <div className="ciclo-left">
            <span className="ciclo-dot"></span>
            <span className="ciclo-dates">
              {formatDate(ciclo.start_date)} —{" "}
              {ciclo.end_date ? formatDate(ciclo.end_date) : "Hoy"}
            </span>
          </div>

          <div className="ciclo-right">
            {/* <span className="ciclo-tag">{ciclo.nombre || "Ciclo Activo"}</span> */}
            <span className="ciclo-tag">Ciclo Actual</span>
          </div>
        </div>
      </div>
    </div>
  );
}
