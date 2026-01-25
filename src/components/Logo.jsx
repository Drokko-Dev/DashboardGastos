import "../styles/logo.css";

export function Logo() {
  return (
    <h1 className="brand-title">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24" // Agregado para que no se corte el dibujo
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="icon icon-tabler icons-tabler-outline icon-tabler-coins"
      >
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6366F1" />{" "}
            {/* Nota: stopColor con C mayúscula en React */}
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        <path stroke="none" d="M0 0h24v24H0z" />

        {/* Cambiamos el color de línea a la URL del gradiente */}
        <g stroke="url(#logo-gradient)">
          <path d="M9 14c0 1.657 2.686 3 6 3s6-1.343 6-3-2.686-3-6-3-6 1.343-6 3" />
          <path d="M9 14v4c0 1.656 2.686 3 6 3s6-1.344 6-3v-4M3 6c0 1.072 1.144 2.062 3 2.598s4.144.536 6 0c1.856-.536 3-1.526 3-2.598 0-1.072-1.144-2.062-3-2.598s-4.144-.536-6 0C4.144 3.938 3 4.928 3 6" />
          <path d="M3 6v10c0 .888.772 1.45 2 2" />
          <path d="M3 11c0 .888.772 1.45 2 2" />
        </g>
      </svg>
      FinanceTracker
    </h1>
  );
}
