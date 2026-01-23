import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const svgLogo = (
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
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
);

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>{svgLogo} FinanceTracker</h1>
          <button className="close-sidebar" onClick={toggleSidebar}>
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
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end onClick={toggleSidebar}>
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="currentColor"
                className="icon icon-tabler icons-tabler-filled icon-tabler-chart-donut"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M11.292 2.61c.396.318.65.78.703 1.286L12 4v4a1 1 0 0 1-.748.968 3.1 3.1 0 1 0 3.78 3.78A1 1 0 0 1 16 12h3.8a2 2 0 0 1 2 2 1 1 0 0 1-.026.226 10 10 0 1 1-12-12l.057-.01.052-.01a1.9 1.9 0 0 1 1.409.404m3.703-.11.045.002.067.004.081.014.032.004.072.022.04.01a10 10 0 0 1 6.003 5.818l.108.294A1 1 0 0 1 20.5 10H16a1 1 0 0 1-.76-.35 8 8 0 0 0-.89-.89A1 1 0 0 1 14 8V3.5q.001-.119.026-.23l.03-.102a1 1 0 0 1 .168-.299l.03-.033.039-.043a1 1 0 0 1 .089-.08l.051-.034.03-.023.045-.025.052-.03a1 1 0 0 1 .435-.101" />
              </svg>
              Resumen
            </h1>
          </NavLink>
          <NavLink to="/detalle" onClick={toggleSidebar}>
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="icon icon-tabler icons-tabler-outline icon-tabler-database-dollar"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3" />
                <path d="M4 6v6c0 1.657 3.582 3 8 3 .415 0 .822-.012 1.22-.035M20 10V6" />
                <path d="M4 12v6c0 1.657 3.582 3 8 3 .352 0 .698-.009 1.037-.025M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H17M19 21v1m0-8v1" />
              </svg>
              Movimientos
            </h1>
          </NavLink>
          <NavLink to="/papelera" onClick={toggleSidebar}>
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
              </svg>
              Papelera
            </h1>
          </NavLink>
          <NavLink to="/seguridad" onClick={toggleSidebar}>
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="currentColor"
                className="icon icon-tabler icons-tabler-filled icon-tabler-shield-lock"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="m11.998 2 .118.007.059.008.061.013.111.034a.993.993 0 0 1 .217.112l.104.082.255.218a11 11 0 0 0 7.189 2.537l.342-.01a1 1 0 0 1 1.005.717 13 13 0 0 1-9.208 16.25 1 1 0 0 1-.502 0A13 13 0 0 1 2.54 5.718a1 1 0 0 1 1.005-.717 11 11 0 0 0 7.531-2.527l.263-.225.096-.075a.993.993 0 0 1 .217-.112l.112-.034a.97.97 0 0 1 .119-.021L11.998 2zM12 9a2 2 0 0 0-1.995 1.85L10 11l.005.15A2 2 0 0 0 11 12.731V14.5l.007.117A1 1 0 0 0 13 14.5l.001-1.768A2 2 0 0 0 12 9z" />
              </svg>
              Seguridad
            </h1>
          </NavLink>

          {/* BOTÓN LOGOUT: Ahora dentro del menú */}
          <button
            className="btn-logout-sidebar"
            onClick={() => supabase.auth.signOut()}
          >
            Salir 🚪
          </button>
        </nav>
      </aside>

      {/* Overlay para cerrar al tocar fuera */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};
