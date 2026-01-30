import React from "react";

// Iconos simplificados para no llenar el código
const EyeIcon = ({ closed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {closed ? (
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

export function ResumenCards({
  totalMes,
  gastoMes,
  ahorroMes,
  states,
  onToggle,
}) {
  const cards = [
    {
      id: "total",
      label: "Saldo Total",
      value: totalMes,
      isPrivate: states.total,
      color: totalMes < 0 ? "var(--accent-red)" : "var(--accent-green)",
      icon: (
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      ),
    },
    {
      id: "ingreso",
      label: "Ingreso Mensual",
      value: ahorroMes,
      isPrivate: states.ingreso,
      color: "#10b981",
      icon: <path d="M12 19V5M5 12l7-7 7 7" />,
    },
    {
      id: "gasto",
      label: "Gasto Mensual",
      value: gastoMes,
      isPrivate: states.gasto,
      color: "#f43f5e",
      icon: <path d="M12 5v14M5 12l7 7 7-7" />,
    },
  ];

  return (
    <div className="resumen-grid-premium">
      {cards.map((card) => (
        <div key={card.id} className="premium-card">
          <div className="premium-card-header">
            <span className="premium-label">{card.label}</span>
            <button
              onClick={() => onToggle(card.id)}
              className={`premium-eye-btn ${card.isPrivate ? "active" : ""}`}
            >
              <EyeIcon closed={card.isPrivate} />
            </button>
          </div>

          <div className="premium-card-body">
            <h2
              className="premium-amount"
              style={{
                color: card.isPrivate ? "var(--text-muted)" : card.color,
              }}
            >
              {card.isPrivate
                ? "••••••••"
                : card.id === "gasto"
                  ? `-$${card.value.toLocaleString("es-CL")}`
                  : `$${card.value.toLocaleString("es-CL")}`}
            </h2>
          </div>

          <div className="premium-card-bg-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              {card.icon}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
