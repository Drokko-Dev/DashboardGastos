import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo";
import "../../styles/pages/Login/login.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            setMessage("¡Listo! Revisa tu correo electrónico para el enlace de recuperación.");
        }
        setLoading(false);
    };

    return (
        <div className="auth-screen">
            <div className="login-box">
                <div className="login-card">
                    <header className="login-header">
                        <Logo />
                        <h1>Recuperar acceso</h1>
                        <p>Ingresa tu correo y te enviaremos los pasos</p>
                    </header>

                    {message ? (
                        <div className="success-message" style={{ textAlign: 'center', padding: '20px' }}>
                            <p style={{ color: '#4ade80', marginBottom: '20px' }}>{message}</p>
                            <Link to="/login" className="login-btn" style={{ textDecoration: 'none', display: 'block' }}>
                                Volver al Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="login-form">
                            <div className="field">
                                <label>Email de tu cuenta</label>
                                <input
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                            </button>
                        </form>
                    )}

                    <footer className="login-footer">
                        <Link to="/login">Volver a intentar el ingreso</Link>
                    </footer>
                </div>
            </div>
        </div>
    );
}