import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Info,
  Scale,
  Lock,
  FileText,
  AlertTriangle,
  Gavel,
  Database,
  Edit,
} from "lucide-react";
import "/src/styles/pages/Landing/terms.css";
export const Terms = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="legal-section"
    >
      <div className="legal-container">
        <h1 className="text-gradient">Términos y Condiciones</h1>
        <p className="legal-update">
          Última actualización: 13 de febrero de 2026
        </p>

        {/* CAJA DE RESUMEN (TL;DR) */}
        <div className="legal-summary-box">
          <div className="summary-header">
            <Info size={20} />
            <h4>Resumen rápido para humanos</h4>
          </div>
          <ul>
            <li>Tus datos financieros son 100% privados y encriptados.</li>
            <li>
              No somos una entidad bancaria, somos una herramienta de gestión.
            </li>
            {/*  <li>La suscripción Pro se puede cancelar en cualquier momento.</li> */}
            <li>El uso del Bot de Telegram es un servicio complementario.</li>
          </ul>
        </div>

        <div className="legal-content">
          <section>
            <div className="section-title">
              <Scale size={20} />
              <h3>1. Aceptación y Capacidad</h3>
            </div>
            <p>
              Al utilizar <strong>FinanceTracker</strong>, declaras ser mayor de
              18 años y aceptas estos términos. Esta plataforma es un software
              de gestión financiera personal diseñado para otorgar claridad
              sobre tus flujos de caja.
            </p>
          </section>

          <section>
            <div className="section-title">
              <Lock size={20} />
              <h3>2. Privacidad y Seguridad</h3>
            </div>
            <p>
              En FinanceTracker, la seguridad es nuestra prioridad. Utilizamos
              encriptación avanzada para proteger tus registros. Sin embargo, el
              usuario es responsable de mantener la confidencialidad de su
              contraseña y acceso a su cuenta de Telegram vinculada.
            </p>
          </section>

          <section className="legal-highlight-box">
            <div className="section-title">
              <ShieldCheck size={20} />
              <h3>3. Planes y Suscripciones</h3>
            </div>
            <p>
              <strong>FinanceTracker Pro:</strong> Ofrecemos funciones avanzadas
              bajo un modelo de suscripción mensual o anual. Los pagos se
              procesan de forma segura y el usuario puede cancelar la renovación
              automática desde su perfil en cualquier momento. No se realizan
              reembolsos por periodos ya utilizados.
            </p>
          </section>

          <section>
            <div className="section-title">
              <FileText size={20} />
              <h3>4. Propiedad Intelectual</h3>
            </div>
            <p>
              Todo el software, diseño de interfaz, algoritmos y logotipos de{" "}
              <strong>FinanceTracker</strong> son propiedad exclusiva de sus
              desarrolladores. Queda prohibida la reproducción total o parcial
              del código sin autorización previa.
            </p>
          </section>

          {/* PUNTO 5 CORREGIDO */}
          <section>
            <div className="section-title">
              <AlertTriangle size={20} />
              <h3>5. Limitación de Responsabilidad</h3>
            </div>
            <p>
              FinanceTracker no se responsabiliza por decisiones financieras
              tomadas por el usuario basadas en la información de la app. La
              precisión de los reportes depende íntegramente de la veracidad de
              los datos ingresados por el usuario.
            </p>
          </section>

          {/* PUNTO 7: PRIVACIDAD Y DATOS */}
          <section>
            <div className="section-title">
              <Database size={20} />
              <h3>6. Gestión de Información y Privacidad</h3>
            </div>
            <p>
              En <strong>FinanceTracker</strong>, entendemos que tu historial
              financiero es sensible. Nos comprometemos a procesar tus datos
              bajo los estándares de la{" "}
              <strong>
                normativa chilena de protección de la vida privada
              </strong>
              .
            </p>
            <p>
              Esto significa que tu información se utiliza exclusivamente para
              generar tus reportes y sincronizar tus registros con Telegram. No
              comercializamos tus datos con terceros. Para cualquier duda sobre
              tu información, puedes escribirnos directamente a nuestro canal de
              soporte oficial.
            </p>
          </section>

          {/* PUNTO 8: ACTUALIZACIONES DEL ACUERDO */}
          <section>
            <div className="section-title">
              <Edit size={20} />
              <h3>7. Evolución de la Plataforma y sus Reglas</h3>
            </div>
            <p>
              Como software en constante mejora, <strong>FinanceTracker</strong>{" "}
              se reserva el derecho de ajustar estas reglas para adaptarlas a
              nuevas funciones.
            </p>
            <p>
              Si realizamos cambios importantes, te avisaremos con antelación.
              Si decides seguir usando la app después de la actualización,
              entenderemos que estás de acuerdo con las nuevas condiciones.
            </p>
          </section>

          {/* PUNTO 6 CORREGIDO */}
          <section>
            <div className="section-title">
              <Gavel size={20} />
              <h3>8. Jurisdicción y Ley Aplicable</h3>
            </div>
            <p>
              Este acuerdo se rige por las leyes de la República de Chile. Para
              cualquier controversia, las partes se someten a la jurisdicción de
              los tribunales ordinarios de Santiago.
            </p>
          </section>
        </div>

        <div className="legal-contact-footer">
          <p>
            ¿Dudas? Escríbenos a:{" "}
            <a href="mailto:legal@financetracker.cl">
              Por el momento solo hablame al wsp
            </a>
          </p>
        </div>
      </div>
    </motion.section>
  );
};
