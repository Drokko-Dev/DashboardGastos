import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  LineChart,
  Line,
  LabelList,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  LayoutDashboard,
  LogOut,
  Wallet,
  Link as LinkIcon,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { ResumenCards } from "./ResumenCards";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function Detalle({ session }) {
  // Estados para los datos
  const [gastosRaw, setGastosRaw] = useState([]);
  const [nickname, setNickname] = useState(null);
  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLink();
  }, []);

  // 1. Verificar si el usuario ya está vinculado
  async function checkUserLink() {
    setLoading(true);

    // 1. Buscamos el perfil vinculado
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id_telegram")
      .eq("auth_id", session.user.id)
      .single();

    if (profile?.id_telegram) {
      setTelegramId(profile.id_telegram);

      // 2. Buscamos el nombre en la tabla users usando el id_telegram
      // NOTA: Usamos { data: userData } para renombrar 'data' a 'userData'
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("full_name")
        .eq("id_telegram", profile.id_telegram)
        .single();

      // Verificamos que userData exista antes de setear el nickname
      if (userData) {
        setNickname(userData.full_name);
      }

      // 3. Cargamos los gastos
      fetchExpenses();
    }

    setLoading(false);
  }

  // 2. Cargar los gastos (Tu lógica original)
  async function fetchExpenses() {
    const { data: gastos, error } = await supabase
      .from("gastos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && gastos) {
      setGastosRaw(gastos);
      /* console.log(gastos); */
    }
  }

  // 3. Función para vincular por primera vez
  async function handleLink() {
    if (!inputID) return alert("Por favor ingresa tu ID");

    const { error } = await supabase
      .from("profiles")
      .insert([{ auth_id: session.user.id, id_telegram: inputID }]);

    if (!error) {
      setTelegramId(inputID);
      fetchExpenses();
    } else {
      alert("Error al vincular: " + error.message);
    }
  }
  const añoHoy = new Date().getFullYear();
  const NOMBRES_MESES = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <h1>
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
        </h1>
        <h2>Cargando Perfil...</h2>
      </div>
    );
  return (
    <>
      <Navbar nickname={nickname} session={session} />
      <div className="resumen-container">
        <section className="tickets">
          <div className="tickets-header">
            <h1 className="tituloGastos">Resumen Movimientos</h1>
            <button className="tickets-detalle">Detalle</button>
          </div>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoria</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticket">
            {gastosRaw.slice(0, 10).map((g, i) => (
              <article className="ticket-card" key={g.id}>
                <p className="fecha-registro">
                  {g.created_at.replace("T", " ").slice(0, 16)}
                </p>
                <p>{g.description_ia_bot || "Sin descripción"}</p>
                <h2>{g.category || "GENERAL"}</h2>
                <span
                  style={{ color: g.type === "gasto" ? "#ef4444" : "#36d35d" }}
                >
                  ${Number(g.amount || g.monto).toLocaleString("es-CL")}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
