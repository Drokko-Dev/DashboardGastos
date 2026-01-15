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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Dashboard de Gastos</h2>
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
  );
}
