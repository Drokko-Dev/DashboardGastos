import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import "../styles/pages/Login/login.css"; // Reutilizamos el CSS del Login para consistencia

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Importante: Esto envía el nombre al trigger de la DB
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(
        "¡Registro exitoso! Por favor, revisa tu correo para confirmar la cuenta.",
      );
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      {/* Orbs de fondo */}
      <div className="login-orbs">
        <div className="l-orb l-orb-1"></div>
        <div className="l-orb l-orb-2"></div>
      </div>

      <div className="login-box">
        <div className="login-card">
          <header className="login-header">
            <Logo />
            <h1>Crea tu cuenta</h1>
            <p>Únete y empieza a dominar tus finanzas</p>
          </header>

          <form onSubmit={handleSignUp} className="login-form">
            <div className="field">
              <label>Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Correo Electrónico</label>
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarme ahora"}
            </button>
          </form>

          <footer className="login-footer">
            <span>¿Ya tienes una cuenta?</span>
            <Link to="/login">Inicia sesión aquí</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};
