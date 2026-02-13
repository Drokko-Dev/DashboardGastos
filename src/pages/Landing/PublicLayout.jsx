import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  RefreshCw,
  BarChart3,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import "/src/styles/pages/Landing/landing.css";
import "/src/styles/pages/Landing/footer.css";
import { Logo } from "../../components/Logo";
export const PublicLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const pasosCiclo = [
    {
      icon: <Wallet size={32} />,
      title: "Inicia con tu Ingreso",
      text: "Al registrar tu sueldo, activas un nuevo ciclo. Esto establece tu presupuesto real desde el día 1.",
    },
    {
      icon: <Target size={32} />,
      title: "Seguimiento Inteligente",
      text: "Cada gasto se resta de tu presupuesto activo, dándote una visión clara de cuánto te queda disponible.",
    },
    {
      icon: <RefreshCw size={32} />,
      title: "Cierre y Reinicio",
      text: "¿Llegó el próximo sueldo? Cierra el ciclo actual y comienza uno nuevo, todo en un click.",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Análisis Comparativo",
      text: "Compara ciclos anteriores para entender tus patrones de gasto y mejorar tu capacidad de ahorro.",
    },
  ];
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const revealVariant = {
    hidden: { opacity: 0, y: 50 }, // Empieza invisible y 50px abajo
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

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
      ) : (
        <></>
      )}

      {/* NAVBAR PREMIUM */}
      <nav className="landing-nav">
        <div className="logo-container">
          <Link to="/" className="logo-link">
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
