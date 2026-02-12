import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import "../styles/pages/Login/login.css"; // Ruta a tu nuevo CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      {/* Orbs de fondo exclusivos para el login */}
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
