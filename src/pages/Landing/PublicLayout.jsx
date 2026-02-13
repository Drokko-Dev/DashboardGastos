import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "../../components/Logo";

import "/src/styles/pages/Landing/public_layout.css";

export const PublicLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Para que suba con una animación suave
    });
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false); // <--- Esto cierra el menú al navegar
  }, [pathname]);

  return (
    <div className="landing-container">
      {/* FONDO DINÁMICO DE ORBS */}
      <div className="bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      {/* SIDEBAR MÓVIL (DESDE ARRIBA) */}
      {isMobile ? (
        <>
          {menuOpen && (
            <div className="sidebar-overlay" onClick={toggleMenu}></div>
          )}
          <aside className={`sidebar-mobile ${menuOpen ? "open" : ""}`}>
            <nav className="sidebar-nav">
              <Link to="/login" className="btn-sidebar" onClick={toggleMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="btn-sidebar" onClick={toggleMenu}>
                Crear mi cuenta ahora
              </Link>
            </nav>
          </aside>
        </>
      ) : (
        <></>
      )}

      {/* NAVBAR PREMIUM */}
      <nav className="landing-nav">
        <div className="logo-container">
          <Link
            to="/"
            className="logo-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo />
          </Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="link-secondary">
            Iniciar Sesión
          </Link>
          {isMobile ? (
            <button className="menu-toggle" onClick={toggleMenu}>
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="icon icon-tabler icons-tabler-outline icon-tabler-x close-icon"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2 menu-icon"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          ) : (
            <></>
          )}
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO (Aquí caerá Landing o SobreNosotros) */}
      <main className="landing-main-content">{children}</main>

      <footer className="landing-footer">
        <div className="footer-content">
          {/* Columna 1: Marca */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Logo />
            </div>
            <p>
              La billetera digital que te ayuda a entender tus ciclos
              financieros y tomar el control real de tu dinero en Chile.
            </p>
          </div>

          {/* Columna 2: App */}
          <div className="footer-links-group">
            <h4>Producto</h4>
            <ul>
              <li>
                <Link to="/signup">Crear cuenta</Link>
              </li>
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li>
                <a href="#features">Funcionalidades</a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal & Soporte */}
          <div className="footer-links-group">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/sobre-nosotros">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/soporte">Soporte</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 FinanceTracker. Claridad financiera a un clic.</p>
          <div className="footer-socials">
            {/* Puedes agregar iconos de redes sociales aquí luego */}
            <small className="text-muted">Santiago, Chile</small>
          </div>
        </div>
      </footer>
    </div>
  );
};
