import React from "react";
import { NavLink } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import "/src/styles/pages/Sidebar/ayuda.css";

export const Ayuda = () => {
  return (
    <div className="ayuda-page">
      <div className="ayuda-header">
        <h1>Centro de Ayuda</h1>
        <p>Accede a soporte y configuración de privacidad</p>
      </div>

      <nav className="ayuda-nav-list">
        {/* GUÍA DE USO - Instrucciones */}
        <NavLink to="/guia-uso" className="ayuda-item">
          <div className="ayuda-item-content">
            <BookOpen size={24} color="#f59e0b" />
            <div className="ayuda-text">
              <h3>Guía de Inicio y Conceptos</h3>
              <p>Aprende a dominar tus ciclos y el Bot de Telegram</p>
            </div>
          </div>
          <ChevronRight size={18} className="icon-arrow" />
        </NavLink>

        {/* TELEGRAM - Link Externo */}
        <a
          href="https://t.me/JaimeVega_FT"
          target="_blank"
          rel="noreferrer"
          className="ayuda-item"
        >
          <div className="ayuda-item-content">
            <MessageCircle size={24} color="#0088cc" />
            <div className="ayuda-text">
              <h3>Comunidad Telegram</h3>
              <p>Soporte rápido y actualizaciones</p>
            </div>
          </div>
          <ExternalLink size={18} className="icon-arrow" />
        </a>

        {/* PRIVACIDAD - NavLink Interno (Igual que el Sidebar) */}
        <NavLink to="/privacidad-config" className="ayuda-item">
          <div className="ayuda-item-content">
            <ShieldCheck size={24} color="var(--accent-teal)" />
            <div className="ayuda-text">
              <h3>Términos y Privacidad</h3>
              <p>Revisa cómo protegemos tus datos</p>
            </div>
          </div>
        </NavLink>
      </nav>

      <div className="ayuda-footer">
        <small>FinanceTracker v2026.1</small>
      </div>
    </div>
  );
};
