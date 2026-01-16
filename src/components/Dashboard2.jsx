import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
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

export default function Dashboard({ session }) {
  // Estados para los datos
  const [gastosRaw, setGastosRaw] = useState([]);
  const [dataBarras, setDataBarras] = useState([]);
  const [dataTorta, setDataTorta] = useState([]);
  const [totalMes, setTotalMes] = useState(0);

  // Estados para la vinculación
  const [telegramId, setTelegramId] = useState(null);
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
      const suma = gastos.reduce(
        (acc, g) => acc + Number(g.amount || g.monto || 0),
        0
      );
      setTotalMes(suma);

      const porFecha = gastos.reduce((acc, g) => {
        const f = g.created_at.split("T")[0];
        acc[f] = (acc[f] || 0) + Number(g.amount || g.monto || 0);
        return acc;
      }, {});
      setDataBarras(
        Object.keys(porFecha)
          .map((f) => ({ fecha: f, total: porFecha[f] }))
          .reverse()
      );

      const porCat = gastos.reduce((acc, g) => {
        const c = g.category || "Otros";
        acc[c] = (acc[c] || 0) + Number(g.amount || g.monto || 0);
        return acc;
      }, {});
      setDataTorta(
        Object.keys(porCat).map((c) => ({ name: c, value: porCat[c] }))
      );
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

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-indigo-600">
        Cargando perfil...
      </div>
    );

  // VISTA A: Si no está vinculado, mostramos el formulario
  if (!telegramId) {
    return (
      <div className="dashboard-container flex items-center justify-center min-h-[70vh]">
        <div className="card max-w-md w-full text-center shadow-2xl border-t-4 border-indigo-500">
          <div className="bg-indigo-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <LinkIcon className="text-indigo-600" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Vincular Telegram</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Para ver tus gastos personalizados, pega aquí el ID que te dio el
            bot con el comando{" "}
            <span className="font-bold text-slate-800">/web</span>.
          </p>
          <input
            type="text"
            placeholder="Pega tu ID aquí..."
            className="w-full p-4 border-2 border-slate-100 rounded-2xl mb-6 text-center text-xl font-mono focus:border-indigo-500 outline-none transition-all"
            value={inputID}
            onChange={(e) => setInputID(e.target.value)}
          />
          <button
            onClick={handleLink}
            className="btn-primary w-full py-4 text-lg shadow-lg shadow-indigo-200"
          >
            Comenzar a visualizar
          </button>
        </div>
      </div>
    );
  }

  // VISTA B: El Dashboard con tus gráficos originales
  return (
    <>
      <Navbar nickname={nickname} session={session} />
      <div className="resumen-container">
        <ResumenCards totalMes={totalMes} gastoMes={totalMes} ahorroMes={0} />

        <div className="charts-grid">
          {/* Gráfico de Torta: Gastos por Categoría */}
          <div className="chart-card">
            <div className="chart-header">
              <h2>Gastos por Categoría</h2>
              <p>Distribución mensual</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataTorta}
                    cx="50%" /* Centrado horizontal exacto */
                    cy="50%" /* Centrado vertical exacto */
                    innerRadius={80} /* Radio interno */
                    outerRadius={110} /* Radio externo */
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataTorta.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    /* Estilo del contenedor del cuadrito */
                    contentStyle={{
                      backgroundColor: "#1c1c1c",
                      border: "1px solid #2e2e2e",
                      borderRadius: "12px",
                      padding: "10px",
                    }}
                    /* Estilo del texto que dice "Alimentos : 28106" */
                    itemStyle={{
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                    /* Opcional: Para que el número tenga formato de moneda */
                    formatter={(value) =>
                      `$${Number(value).toLocaleString("es-CL")}`
                    }
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aquí puedes agregar un segundo gráfico (ej: Barras) en el futuro */}
        </div>

        <section className="tickets">
          <h1 className="tituloGastos">Resumen de Movimientos</h1>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoria</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticket">
            {gastosRaw.map((g, i) => (
              <article className="ticket-card" key={g.id}>
                <p className="fecha-registro">
                  {g.created_at.replace("T", " ").slice(0, 16)}
                </p>
                <p>{g.description_ia_bot || "Sin descripción"}</p>
                <h2>{g.category || "GENERAL"}</h2>
                <span>${Number(g.amount || g.monto).toLocaleString()}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
