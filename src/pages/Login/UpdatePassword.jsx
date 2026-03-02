import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import "../../styles/pages/Login/login.css";
import { useAuth } from "../../context/AuthContext";

export default function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    /*     const [recoveryReady, setRecoveryReady] = useState(false); */
    const navigate = useNavigate();
    const { setIsRecovering } = useAuth();

    useEffect(() => {
        // 1. Escuchar el evento de recuperación de Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                setRecoveryReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Actualizar la contraseña en Supabase
        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            alert("Error al actualizar: " + error.message);
        } else {
            alert("¡Contraseña actualizada con éxito! Por seguridad, ingresa ahora con tu nueva clave.");
            localStorage.removeItem("bloqueo_recuperacion"); // <-- APAGAMOS EL ESCUDO
            await supabase.auth.signOut();

            // 2. Cerrar la sesión temporal de emergencia
            await supabase.auth.signOut();

            // 3. Apagar el "escudo" para que la app vuelva a funcionar normal
            if (setIsRecovering) {
                setIsRecovering(false);
            }

            // 4. Reinicio duro: Usamos href en vez de navigate() para limpiar 
            // completamente la URL y la memoria de React.
            window.location.href = "/login";
        }
        setLoading(false);
    };

    return (
        <div className="auth-screen">
            <div className="login-box">
                <div className="login-card">
                    <header className="login-header">
                        <Logo />
                        <h1>Nueva Contraseña</h1>
                        <p>Escribe tu nueva clave de acceso</p>
                    </header>

                    <form onSubmit={handleUpdate} className="login-form">
                        <div className="field">
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Actualizando..." : "Confirmar nueva contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}