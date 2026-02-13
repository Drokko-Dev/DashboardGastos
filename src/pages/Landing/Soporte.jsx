import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, HelpCircle, Send } from "lucide-react";
import "/src/styles/pages/Landing/soporte.css";

export const Soporte = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="soporte-section"
    >
      <div className="soporte-container">
        <h1 className="text-gradient">¿Cómo podemos ayudarte?</h1>
        <p className="soporte-subtitle">
          Estamos aquí para resolver tus dudas y ayudarte a tomar el control de
          tus finanzas.
        </p>

        <div className="soporte-grid">
          {/* Canal Telegram */}
          <div className="soporte-card highlight-card">
            <div className="soporte-icon-box">
              <MessageCircle size={32} />
            </div>
            <h3>Soporte vía Telegram</h3>
            <p>
              Escríbeme directamente para resolver tus dudas o reportar
              cualquier problema con FinanceTracker
            </p>
            <a
              href="https://t.me/JaimeVega_FT"
              target="_blank"
              rel="noreferrer"
              className="btn-soporte"
            >
              Abrir Telegram <Send size={16} />
            </a>
          </div>

          {/* Canal Email */}
          <div className="soporte-card">
            <div className="soporte-icon-box">
              <Mail size={32} />
            </div>
            <h3>Correo Electrónico</h3>
            <p>
              Para consultas legales, comerciales o problemas con tu cuenta Pro.
            </p>
            <a
              /* href="mailto:contacto@financetracker.cl" */
              className="link-soporte"
            >
              No disponible por ahora.
            </a>
          </div>
        </div>

        {/* Sección FAQ Rápida */}
        <div className="faq-section">
          <div className="section-title">
            <HelpCircle size={24} />
            <h2>Preguntas Frecuentes</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>¿Cómo vinculo mi cuenta con Telegram?</h4>
              <p>
                Dentro de tu Dashboard, ve a Perfil y copia tu código único.
                Pégalo en el chat de nuestro Bot y listo.
              </p>
            </div>
            <div className="faq-item">
              <h4>¿Puedo exportar mis datos?</h4>
              <p>
                ¡Sí! En la sección de reportes puedes bajar tus ciclos en PDF y
                Excel en cualquier momento.
              </p>
            </div>
            <div className="faq-item">
              <h4>¿Es seguro registrar mis gastos?</h4>
              <p>
                Totalmente. Usamos encriptación de extremo a extremo y nunca
                compartimos tu información financiera.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
