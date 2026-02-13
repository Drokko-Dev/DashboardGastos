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
import "../styles/pages/Landing/landing.css";
import { Logo } from "../components/Logo";
export const Landing = () => {
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
      text: "¿Llegó el próximo sueldo? Cierra el ciclo actual y comienza uno nuevo con la pizarra limpia.",
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
          <Logo />
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

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="badge">Beta Abierta — En Desarrollo</div>
        <h1>
          Toma el control total de{" "}
          <span className="text-gradient">tus finanzas</span>
        </h1>
        <p className="hero-subtitle">
          Gestiona ciclos de gastos personalizados, descarga reportes y vincula
          tu Telegram para registros en segundos.
        </p>
        <div className="hero-ctas">
          <Link to="/signup" className="btn-main">
            Crear mi cuenta ahora
          </Link>
        </div>
      </header>

      {/* SECCIÓN DE CICLOS (Tu valor diferencial) */}
      <section className="section-ciclos">
        <div className="ciclos-content">
          <h2>
            Adiós a los meses cerrados, <br />
            hola a los <span className="highlight">Ciclos</span>
          </h2>
          <p>
            A diferencia de otras apps, en FinanceTracker tú decides cuándo
            empieza y termina tu mes financiero. Define ciclos basados en tus
            días de pago o metas específicas.
          </p>
          <ul className="ciclos-list">
            <li>✅ Flexibilidad total en fechas de inicio y fin.</li>
            <li>✅ Comparativa inteligente entre periodos anteriores.</li>
            <li>✅ Reportes automáticos al cerrar cada ciclo.</li>
          </ul>
        </div>
        <div className="ciclos-visual">
          {/* Aquí podrías poner una captura de tu Dashboard real */}
          <div className="mockup-screen"></div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: ¿QUÉ SON LOS CICLOS? */}
      <section className="section-que-son">
        <div className="ciclos-info-header">
          <h2>
            ¿Qué son los <span className="highlight">Ciclos</span>?
          </h2>
          <p>
            Es la libertad de ignorar el calendario tradicional. En lugar de
            medir tus gastos forzosamente del 1 al 30, los mides de{" "}
            <strong>sueldo a sueldo</strong>. Es la forma más natural de
            entender tu flujo de caja personal.
          </p>
        </div>
      </section>

      {/* NUEVA SECCIÓN: ¿CÓMO FUNCIONAN? (Grid de pasos) */}
      <section className="section-como-funcionan">
        <h2 className="title-center">¿Cómo funcionan?</h2>
        <div className="pasos-grid">
          {pasosCiclo.map((paso, index) => (
            <div key={index} className="paso-card">
              <div className="paso-icon-box">
                {paso.icon}
                <span className="step-number">{index + 1}</span>
              </div>
              <h3>{paso.title}</h3>
              <p>{paso.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES (Las que ya tenías pero con mejor estilo) */}
      <section id="features" className="features-grid">
        {/* Título y Subtítulo */}
        <div>
          <h2 className="title-features">Potencia tu estrategia</h2>
          <p className="subtitle-features">
            Herramientas diseñadas para darte claridad y rapidez en cada
            registro.
          </p>
        </div>
        {/* Tarjetas */}
        <div className="feature-cards-group">
          <div className="feature-card">
            <div className="f-icon">📄</div>
            <h3>Reportes Pro</h3>
            <p>
              Exporta movimientos en Excel y PDF con un diseño limpio y listo
              para contabilidad.
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon">🤖</div>
            <h3>Bot de Telegram</h3>
            <p>
              Registra gastos por texto sin abrir la web. Sincronización
              instantánea. <strong>(Próximamente voz)</strong>
            </p>
          </div>

          <div className="feature-card">
            <div className="f-icon">🔒</div>
            <h3>Privacidad Total</h3>
            <p>
              Tus datos están encriptados y vinculados a tu cuenta personal de
              forma segura.
            </p>
          </div>
        </div>
      </section>

      {/* COMING SOON / ROADMAP */}
      <section className="roadmap-banner">
        <h3>🚀 Evolucionando para ti</h3>
        <p>
          Estamos trabajando en: <strong>Presupuestos por Categoría</strong>,{" "}
          <strong>Metas de Ahorro</strong> e{" "}
          <strong>Inteligencia Artificial</strong> para detectar gastos hormiga.
        </p>
      </section>

      <footer className="landing-footer">
        <p>© 2026 FinanceTracker. Claridad financiera a un clic.</p>
      </footer>
    </div>
  );
};
