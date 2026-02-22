import React, { useEffect } from "react";
import { History, X, Calendar } from "lucide-react";
// Importamos el CSS que ya sabemos que funciona y tiene el estilo full-screen
import "../../styles/transaction_sheet.css";

// IMPORTANTE: Exportamos como constante para que coincida con tu import { CicloSheet }
export const CicloSheet = ({
    show,
    onClose,
    nombre,
    setNombre,
    presupuesto,
    setPresupuesto,
    onSave
}) => {
    // Bloqueo de scroll del fondo
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="full-screen-overlay">
            <div className="full-screen-container ingreso"> {/* Clase ingreso para el color azul/cian */}

                <header className="full-screen-header">
                    <div className="header-spacer"></div>
                    <h2>Iniciar Nuevo Ciclo</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <main className="full-screen-body">
                    {/* Banner informativo similar al que usas en transacciones */}
                    <div className="special-card-modern" style={{ marginBottom: '25px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <div className="info">
                            <strong style={{ color: '#6366f1' }}>Nuevo Periodo 🚀</strong>
                            <span style={{ color: '#94a3b8' }}>Se cerrará el ciclo actual y se resetearán tus presupuestos.</span>
                        </div>
                    </div>

                    <div className="form-content">
                        <div className="input-block">
                            <label>Nombre del Periodo</label>
                            <div className="monto-input-wrapper" style={{ padding: '14px' }}>
                                <Calendar size={20} style={{ color: '#94a3b8', marginRight: '10px' }} />
                                <input
                                    type="text"
                                    placeholder="Ej: Sueldo Marzo"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    style={{ fontSize: '1.2rem', fontWeight: '600' }}
                                    autoFocus
                                />
                            </div>
                            <span className="char-count">{nombre.length}/30</span>
                        </div>

                        <div className="input-block">
                            <label>Presupuesto Meta</label>
                            <div className="monto-input-wrapper">
                                <span className="symbol">$</span>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={presupuesto}
                                    onChange={(e) => setPresupuesto(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="full-screen-footer">
                    <button className="btn-main-save" onClick={onSave}>
                        Comenzar Ciclo
                    </button>
                </footer>
            </div>
        </div>
    );
};