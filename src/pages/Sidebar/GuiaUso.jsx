import React from "react";
import { motion } from "framer-motion";
import { Info, Send, RefreshCcw, PieChart } from "lucide-react";
import "/src/styles/pages/Sidebar/guia_uso.css";

export const GuiaUso = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="guia-container"
    >
      <div className="guia-header">
        <h1 className="text-gradient">Guía de Inicio</h1>
        <p>Todo lo que necesitas saber para tomar el control de tu dinero.</p>
      </div>

      <div className="guia-content">
        {/* SECCIÓN 1: LOS CICLOS */}
        <section className="guia-section">
          <div className="guia-title">
            <RefreshCcw size={22} color="#08afbe" />
            <h2>El concepto de Ciclos</h2>
          </div>
          <p>
            En FinanceTracker no nos importa el día 1 del mes. Nos importa el
            día que <strong>tú recibes tu dinero</strong>.
          </p>
          <div className="guia-box">
            <ul className="guia-list-explicativa">
              <li>
                <strong>Claridad Real:</strong> Si te pagan los 25 de cada mes,
                tu ciclo comienza ese día y termina cuando tu decidas. Así
                sabrás <em>realmente</em> cuánto dinero tienes para sobrevivir
                hasta el próximo pago.
              </li>
              <li>
                <strong>Sin Reseteos Manuales:</strong> No tienes que "cerrar el
                mes". La app entiende que mientras no entre un nuevo sueldo,
                sigues viviendo en el ciclo actual.
              </li>
              <li>
                <strong>Cierre Automático:</strong> La fecha de término de tu
                ciclo actual se define automáticamente cuando registras tu
                siguiente sueldo
              </li>

              <li>
                <strong>Saldos Arrastrados: (En desarrollo)</strong> Si te sobró
                dinero del ciclo anterior, este se transfiere a tu siguente
                ciclo como ahorro o ingreso.
              </li>
            </ul>
          </div>
        </section>

        {/* SECCIÓN 2: TELEGRAM */}
        <section className="guia-section">
          <div className="guia-title">
            <Send size={22} color="#0088cc" />
            <h2>Vincula tu Telegram</h2>
          </div>
          <p>
            Anota tus gastos, ingresos y ahorros en segundos mientras vas en la
            micro o el metro:
          </p>
          <ol className="guia-steps">
            <li>
              Ve a tu <strong>Perfil</strong> en esta app y copia tu Token
              Único.
            </li>
            <li>
              Busca a <strong>@FinanceTracker_Bot</strong> en Telegram.
            </li>
            <li>Envíale tu token. ¡Listo!</li>
          </ol>
          <p className="hint">
            Tip: Puedes escribir "Café 2500" y el bot lo registrará al instante.
          </p>
        </section>

        {/* SECCIÓN 3: CATEGORÍAS */}
        <section className="guia-section">
          <div className="guia-title">
            <PieChart size={22} color="#6366f1" />
            <h2>Categorías Inteligentes</h2>
          </div>
          <p>
            Organizamos tus finanzas en grupos claros para que sepas exactamente
            a dónde se va tu dinero:
          </p>

          <div className="guia-box">
            <ul className="guia-list-explicativa">
              <li>
                <strong>Categorización Automática:</strong> Si registras un
                movimiento por nuestro{" "}
                <span style={{ fontWeight: "bold" }}>Bot de Telegram</span>, el
                sistema lo categorizará automáticamente. <br />
                <p className="hint" style={{ marginTop: "15px" }}>
                  Por ejemplo, si escribes "Supermercado 45000", el bot
                  entenderá que pertenece a
                  <span style={{ fontWeight: "bold", color: "#bbd83a" }}>
                    {" "}
                    Alimentos
                  </span>{" "}
                  sin que tú hagas nada.
                </p>
              </li>
              <li>
                <strong>Nuestro Ecosistema de Categorías:</strong>
                Contamos con 9 categorías de{" "}
                <span style={{ fontWeight: "bold", color: "#db5959ef" }}>
                  gastos
                </span>{" "}
                diseñadas para el día a día:
                <div className="guia-categories-grid">
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#bbd83a", color: "#bbd83a" }}
                  >
                    Alimentos
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#F59E0B", color: "#F59E0B" }}
                  >
                    Transporte
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#EC4899", color: "#EC4899" }}
                  >
                    Hogar
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#1fce7c", color: "#1fce7c" }}
                  >
                    Salud
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#8B5CF6", color: "#8B5CF6" }}
                  >
                    Ocio
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#0bc5e6", color: "#0bc5e6" }}
                  >
                    Mascotas
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#a8dbdb", color: "#a8dbdb" }}
                  >
                    Compras
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#6366F1", color: "#6366F1" }}
                  >
                    Fijos
                  </span>
                  <span
                    className="cat-tag"
                    style={{ borderLeftColor: "#697fa193", color: "#748cb1" }}
                  >
                    Otros
                  </span>
                </div>
                {/* Separamos la nota explicativa con un estilo diferente */}
                <div className="guia-note-box">
                  <p>
                    <strong> 💡Nota sobre flujos:</strong> Los ingresos y
                    ahorros se gestionan por separado para no alterar tus
                    gráficos de consumo real.
                  </p>
                  <div className="guia-categories-grid">
                    <span
                      className="cat-tag"
                      style={{ borderLeftColor: "#22C55E", color: "#22C55E" }}
                    >
                      Ingreso
                    </span>
                    <span
                      className="cat-tag"
                      style={{ borderLeftColor: "#00d4ff", color: "#00d4ff" }}
                    >
                      Ahorro
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <p className="hint" style={{ marginTop: "15px" }}>
            Ojo: El bot puede cometer error al asignar categorías. Pero siempre
            puedes corregirlo manualmente en la app.
          </p>
        </section>
      </div>
    </motion.div>
  );
};
