import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) alert(error.message);
    else alert("¡Revisa tu correo!");
    setLoading(false);
  };

  return (
    <div
      className="login-container"
      style={{ padding: "20px", textAlign: "center" }}
    >
      <div className="login">
        <h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            className="icon icon-tabler icons-tabler-outline icon-tabler-coins"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M9 14c0 1.657 2.686 3 6 3s6-1.343 6-3-2.686-3-6-3-6 1.343-6 3" />
            <path d="M9 14v4c0 1.656 2.686 3 6 3s6-1.344 6-3v-4M3 6c0 1.072 1.144 2.062 3 2.598s4.144.536 6 0c1.856-.536 3-1.526 3-2.598 0-1.072-1.144-2.062-3-2.598s-4.144-.536-6 0C4.144 3.938 3 4.928 3 6" />
            <path d="M3 6v10c0 .888.772 1.45 2 2" />
            <path d="M3 11c0 .888.772 1.45 2 2" />
          </svg>
          FinanceTracker
        </h2>
        <p>Ingresa tu correo para recibir el enlace de registro</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Enviar Magic Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
