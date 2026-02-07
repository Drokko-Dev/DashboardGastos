import "../styles/ciclo_banner.css";
export function CicloBanner({ ciclo }) {
  if (!ciclo) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div>
      <div className="resumen-container">
        <div className="ciclo-minimal-wrapper">
          <div className="ciclo-left">
            <span className="ciclo-dot"></span>
            <span className="ciclo-dates">
              {formatDate(ciclo.fecha_inicio)} —{" "}
              {ciclo.fecha_fin ? formatDate(ciclo.fecha_fin) : "Hoy"}
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
