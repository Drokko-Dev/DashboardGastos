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

export const Landing = () => {
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

  const revealVariant = {
    hidden: { opacity: 0, y: 50 }, // Empieza invisible y 50px abajo
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* HERO SECTION */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariant}
        className="hero-section"
      >
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
      </motion.header>
      {/* SECCIÓN DE CICLOS (Tu valor diferencial) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariant}
        className="section-ciclos"
      >
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
        {/* <div className="ciclos-visual">
          <div className="mockup-screen"></div>
        </div> */}
      </motion.section>
      {/* NUEVA SECCIÓN: ¿QUÉ SON LOS CICLOS? */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariant}
        className="section-que-son"
      >
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
      </motion.section>
      {/* NUEVA SECCIÓN: ¿CÓMO FUNCIONAN? (Grid de pasos) */}

      <section className="section-como-funcionan">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="title-center"
        >
          ¿Cómo funcionan?
        </motion.h2>
        <div className="pasos-grid">
          {pasosCiclo.map((paso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }} // Efecto cascada
              viewport={{ once: true }}
              className="paso-card"
            >
              <div className="paso-icon-box">
                {paso.icon}
                <span className="step-number">{index + 1}</span>
              </div>
              <h3>{paso.title}</h3>
              <p>{paso.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES (Las que ya tenías pero con mejor estilo) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariant}
        className="features-grid"
        id="features"
      >
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
      </motion.section>
      {/* COMING SOON / ROADMAP */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariant}
        className="roadmap-banner"
      >
        <h3>🚀 Evolucionando para ti</h3>
        <p>
          Estamos trabajando en: <strong>Presupuestos por Categoría</strong>,{" "}
          <strong>Metas de Ahorro</strong> e{" "}
          <strong>Inteligencia Artificial</strong> para detectar gastos hormiga.
        </p>
      </motion.section>
    </>
  );
};
