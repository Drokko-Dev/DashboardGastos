import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import "../styles/pages/Login/login.css"; // Ruta a tu nuevo CSS
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsRecovering } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      localStorage.removeItem("bloqueo_recuperacion");
      if (setIsRecovering) setIsRecovering(false);
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="login-orbs">
        <div className="l-orb l-orb-1"></div>
        <div className="l-orb l-orb-2"></div>
      </div>

      <div className="login-box">
        <div className="login-card">
          <header className="login-header">
            <Logo />
            <h1>Bienvenido de nuevo</h1>
            <p>Ingresa tus datos para gestionar tus ciclos</p>
          </header>

          <form onSubmit={handleLogin} className="login-form">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* CAMBIO AQUÍ: Ahora es un Link que lleva a la nueva página */}
              <div style={{ textAlign: 'right', marginTop: '5px' }}>
                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                  style={{ color: '#6366f1', fontSize: '0.85rem', textDecoration: 'none' }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Verificando..." : "Entrar al Dashboard"}
            </button>
          </form>

          <footer className="login-footer">
            <span>¿Aún no tienes cuenta?</span>
            <Link to="/signup">Crea una ahora</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
