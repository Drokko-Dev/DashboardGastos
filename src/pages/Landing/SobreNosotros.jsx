import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Zap } from "lucide-react";
import "/src/styles/pages/Landing/sobre_nosotros.css";
export const SobreNosotros = () => {
  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="section-nosotros"
      >
        <div className="nosotros-content">
          <h2 className="title-center">Nuestra Misión</h2>
          <p className="subtitulo-landing">
            <strong>FinanceTracker</strong> nació con un objetivo claro:
            simplificar la relación de las personas con su dinero. Creo que la
            claridad financiera no debería ser un privilegio de expertos, sino
            una herramienta al alcance de todos.
          </p>

          <div className="nosotros-grid">
            <div className="nosotros-card">
              <Zap className="icon-teal" size={32} />
              <h3>Agilidad</h3>
              <p>
                Registros en segundos vía Telegram y visualización instantánea
                en la web.
              </p>
            </div>
            <div className="nosotros-card">
              <ShieldCheck className="icon-teal" size={32} />
              <h3>Seguridad</h3>
              <p>
                Protegemos tus datos bajo los más altos estándares y la
                legislación chilena vigente.
              </p>
            </div>
            <div className="nosotros-card">
              <Users className="icon-teal" size={32} />
              <h3>Comunidad</h3>
              <p>
                Diseñado para usuarios reales que buscan libertad, no solo
                números.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
      {/* SECCIÓN DEL CREADOR */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="creador-container"
      >
        <h2 className="title-center">Equipo FinanceTracker</h2>
        <div className="creador-card">
          <div className="creador-foto-wrapper">
            <img
              src="/perfil.png"
              alt="Creador de FinanceTracker"
              className="creador-foto"
            />
            <div className="creador-badge">Founder</div>
          </div>

          <div className="creador-info">
            <span className="creador-tag">Creador de FinanceTracker</span>
            <h3>Jaime Vega</h3>
            <p className="creador-bio">
              "Soy un apasionado por la tecnología. Creé{" "}
              <strong>FinanceTracker</strong> para resolver mis propios desafíos
              financieros y hoy mi objetivo es democratizar herramientas simples
              para que todos tomen decisiones inteligentes con su dinero."
            </p>

            <div className="creador-socials">
              <a
                href="https://linkedin.com/in/tu-perfil"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/tu-github"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
