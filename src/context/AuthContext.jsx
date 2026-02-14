import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  /* const [vistaModo, setVistaModo] = useState("mes"); */
  const [states, setStates] = useState(() => {
    const saved = localStorage.getItem("privacySettings");
    return saved
      ? JSON.parse(saved)
      : { total: false, gasto: false, ingreso: false };
  });
  // ESTADOS GLOBALES DE PERFIL
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("");
  const [idTelegram, setIdTelegram] = useState(null);
  const [currentCycleId, setCurrentCycleId] = useState(null);
  const [cicloData, setCicloData] = useState(null);

  // ESTADOS GLOBALES DE MOVIMIENTOS (La clave de la velocidad)
  const [gastosRaw, setGastosRaw] = useState(() => {
    // Intentamos cargar desde el cache del teléfono apenas abre la app
    const saved = localStorage.getItem("gastos_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingGastos, setLoadingGastos] = useState(false);

  // Función para cambiar el estado (el "ojo")
  const togglePrivacy = (key) => {
    const newStates = { ...states, [key]: !states[key] };
    setStates(newStates);
    localStorage.setItem("privacySettings", JSON.stringify(newStates));
  };

  // 1. FUNCIÓN PARA CARGAR GASTOS (Disponible para toda la app)
  const refreshGastos = async () => {
    setLoadingGastos(true);
    try {
      const { data, error } = await supabase
        .from("transacciones") // <--- CAMBIADO
        .select("*")
        // .is("deleted_at", null) // Asegúrate de tener esta columna o quítala si da error
        .order("date", { ascending: false });

      if (!error && data) {
        setGastosRaw(data);
        localStorage.setItem("gastos_cache", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error cargando movimientos:", err);
    } finally {
      setLoadingGastos(false);
    }
  };

  // 2. FUNCIÓN PARA CARGAR PERFIL
  async function fetchUserProfile(userId) {
    setLoading(true); // <--- Nos aseguramos de que el loading esté activo
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, telegram_id, current_cycle_id")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        setNickname(profile.full_name || "Usuario");
        setIdTelegram(profile.telegram_id);
        setCurrentCycleId(profile.current_cycle_id);

        // Si hay ciclo, esperamos a que cargue también
        if (profile.current_cycle_id) {
          const { data: cicloInfo } = await supabase
            .from("ciclos")
            .select("*")
            .eq("id", profile.current_cycle_id)
            .maybeSingle();
          if (cicloInfo) setCicloData(cicloInfo);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      // SOLO AQUÍ apagamos el loading, cuando ya tenemos TODO
      setLoading(false);
    }
  }

  useEffect(() => {
    // Escuchar cambios en la sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        // Limpieza al cerrar sesión
        setNickname("");
        setRole("");
        setIdTelegram(null);
        setGastosRaw([]);
        localStorage.removeItem("gastos_cache");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  // ... dentro de AuthProvider ...

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Si la pestaña pasa de estar en segundo plano a estar visible
      if (document.visibilityState === "visible" && session) {
        console.log("App recuperada: Refrescando datos...");
        refreshGastos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Limpieza al desmontar el componente
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session]); // Se ejecuta cuando la sesión está activa

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        nickname,
        role,
        idTelegram,
        currentCycleId,
        cicloData,
        gastosRaw,
        loadingGastos,
        refreshGastos,
        states,
        togglePrivacy,
        fetchUserProfile,
        /* vistaModo,
        setVistaModo, */
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
