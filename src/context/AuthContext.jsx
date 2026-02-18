import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { ToastUI } from "../components/ToastUI"; // Componente para mostrar el toast

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

  // --- NUEVO: Estado del Toast ---
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    // 1. LIMPIEZA: Si ya había un temporizador corriendo, lo cancelamos de inmediato
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    // 2. RESET: Forzamos el estado a limpio para que la animación de entrada se reinicie
    setIsExiting(false);
    setToast({ show: true, message, type });

    // 3. PROGRAMAR SALIDA: Guardamos los IDs en las referencias
    // Iniciamos la animación de absorción a los 3.5 segundos
    exitTimerRef.current = setTimeout(() => {
      setIsExiting(true);
    }, 3500);

    // Borramos el componente a los 4 segundos
    timerRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
      setIsExiting(false);
    }, 4100);
  };
  const hideToast = (instant = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    if (instant) {
      setToast({ show: false, message: "", type: "" });
      setIsExiting(false);
    } else {
      // Si no, hacemos la animación elegante de absorción
      setIsExiting(true);
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        setIsExiting(false);
      }, 600);
    }
  };
  useEffect(() => {
    if (session && !loading) {
      // --- NUEVO: Lógica de Saludo Diario ---
      const hoy = new Date().toLocaleDateString("es-CL");
      const ultimoSaludo = localStorage.getItem("ultimo_saludo");

      if (ultimoSaludo !== hoy) {
        // Personalizamos el saludo con el nickname que ya tienes en el context
        const mensaje = `¡Buenos días, ${nickname || "Usuario"}! ☀️`;
        showToast(mensaje, "success");
        localStorage.setItem("ultimo_saludo", hoy);
      }
    }
  }, [session, loading, nickname]);

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
        showToast,
        hideToast,
        /* vistaModo,
        setVistaModo, */
      }}
    >
      {children}
      <ToastUI toast={toast} isExiting={isExiting} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
