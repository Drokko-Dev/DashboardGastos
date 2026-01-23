import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "./Navbar";

export function Seguridad() {
  return (
    <>
      <Navbar />
      <div className="seguridad-container">
        <header className="seguridad-header">
          <div className="icon-shield">🛡️</div>
          <h1>Tu Privacidad es Primero</h1>
          <p>En FinanceTracker, tus finanzas son solo para tus ojos.</p>
        </header>

        <section className="seguridad-grid">
          <div className="seguridad-card">
            <h3>🔐 Encriptación AES-256</h3>
            <p>
              Tu descripción y monto se cifran en **tu dispositivo** antes de
              subir a la nube. Esto significa que viajan como un código secreto
              que solo tu sesión puede abrir.
            </p>
          </div>

          <div className="seguridad-card">
            <h3>👤 Seudonimización BI</h3>
            <p>
              Para nuestras estadísticas, tu identidad se reemplaza por un
              **Hash único**. Sabemos que "un usuario" está activo, pero jamás
              sabremos que eres tú.
            </p>
          </div>

          <div className="seguridad-card">
            <h3>🧱 Supabase RLS</h3>
            <p>
              Usamos *Row Level Security*. Es un muro digital que garantiza que
              nadie, ni siquiera los administradores, pueda consultar filas que
              no le pertenecen.
            </p>
          </div>

          <div className="seguridad-card">
            <h3>⌛ Periodo de Gracia</h3>
            <p>
              Si borras algo, va a la **Papelera** por 5 días. Después de ese
              tiempo, se elimina físicamente de nuestros servidores para
              siempre.
            </p>
          </div>
        </section>

        <footer className="seguridad-footer">
          <p>
            FinanceTracker v1.0 — Desarrollado con estándares de privacidad.
          </p>
        </footer>
      </div>
    </>
  );
}
