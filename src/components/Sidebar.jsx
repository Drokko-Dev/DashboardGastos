import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const settings = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="currentColor"
    className="icon icon-tabler icons-tabler-filled icon-tabler-adjustments"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 3a1 1 0 0 1 .993.883L7 4v3.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L5 20v-7.17a3.002 3.002 0 0 1-1.995-2.654L3 10l.005-.176A3.002 3.002 0 0 1 5 7.17V4a1 1 0 0 1 1-1zM12 3a1 1 0 0 1 .993.883L13 4v9.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L11 20v-1.17a3.002 3.002 0 0 1-1.995-2.654L9 16l.005-.176A3.002 3.002 0 0 1 11 13.17V4a1 1 0 0 1 1-1zM18 3a1 1 0 0 1 .993.883L19 4v.171a3.001 3.001 0 0 1 0 5.658V20a1 1 0 0 1-1.993.117L17 20V9.83a3.002 3.002 0 0 1-1.995-2.654L15 7l.005-.176A3.002 3.002 0 0 1 17 4.17V4a1 1 0 0 1 1-1z" />
  </svg>
);
const LogOut = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-door-exit"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M13 12v.01M3 21h18M5 21V5a2 2 0 0 1 2-2h7.5M17 13.5V21M14 7h7m-3-3 3 3-3 3" />
  </svg>
);
const svgLogo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-coins"
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path stroke="none" d="M0 0h24v24H0z" />
    <g stroke="url(#logo-gradient)">
      <path d="M9 14c0 1.657 2.686 3 6 3s6-1.343 6-3-2.686-3-6-3-6 1.343-6 3" />
      <path d="M9 14v4c0 1.656 2.686 3 6 3s6-1.344 6-3v-4M3 6c0 1.072 1.144 2.062 3 2.598s4.144.536 6 0c1.856-.536 3-1.526 3-2.598 0-1.072-1.144-2.062-3-2.598s-4.144-.536-6 0C4.144 3.938 3 4.928 3 6" />
      <path d="M3 6v10c0 .888.772 1.45 2 2" />
      <path d="M3 11c0 .888.772 1.45 2 2" />
    </g>
  </svg>
);

const DownloadIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-download"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2M7 11l5 5l5 -5M12 4v12" />
  </svg>
);
const APP_VERSION = "1.1.0";
export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { session, nickname, role } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // BLOQUEO DE SCROLL: Evita que el fondo se mueva en móviles
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Limpieza al desmontar para evitar que la web quede bloqueada
    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link
            onClick={toggleSidebar}
            className="logo-link"
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h1>
              {svgLogo} FinanceTracker{" "}
              <span className="app-version-tag">v{APP_VERSION}</span>
            </h1>
          </Link>

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
          <NavLink
            to="/"
            end
            onClick={toggleSidebar}
            className="sidebar-item-page"
          >
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

          <NavLink
            to="/detalle"
            onClick={toggleSidebar}
            className="sidebar-item-page"
          >
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

          <NavLink
            to="/descargas"
            onClick={toggleSidebar}
            className="sidebar-item-page"
          >
            <h1>
              {DownloadIcon}
              Descargas
            </h1>
          </NavLink>

          <NavLink
            to="/papelera"
            onClick={toggleSidebar}
            className="sidebar-item-page"
          >
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

          <NavLink
            to="/seguridad"
            onClick={toggleSidebar}
            className="sidebar-item-page"
          >
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
          {/* SECCIÓN DE PERFIL */}
          <div className="sidebar-profile-wrapper">
            <div
              className="sidebar-user-card"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img className="sidebar-avatar" src="/banana.png" alt="Avatar" />
              <div className="sidebar-user-info">
                <div>
                  <span className="sidebar-nickname">
                    {nickname || "Usuario"}
                  </span>
                  {role === "admin" && (
                    <span className="admin-badge">{role}</span>
                  )}
                </div>
                <span className="sidebar-email">{session?.user?.email}</span>
              </div>
              <svg
                className={`sidebar-chevron ${showProfileMenu ? "rotated" : ""}`}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {showProfileMenu && (
              <div className="sidebar-profile-dropdown">
                <NavLink
                  to="/profile"
                  onClick={toggleSidebar}
                  className="dropdown-item item-conf"
                >
                  <span>{settings}Configuración Perfil</span>
                </NavLink>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="dropdown-item logout-btn"
                >
                  {LogOut} Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/*  <button
            className="btn-logout-sidebar"
            onClick={() => supabase.auth.signOut()}
          >
            Salir 🚪
          </button> */}
        </nav>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};
