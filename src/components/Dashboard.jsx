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
  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLink();
  }, []);

  // 1. Verificar si el usuario ya está vinculado
  async function checkUserLink() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id_telegram")
      .eq("auth_id", session.user.id)
      .single();

    if (data?.id_telegram) {
      setTelegramId(data.id_telegram);
      fetchExpenses(); // Si está vinculado, cargamos los gastos
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
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="card header-main">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Mi Panel Financiero</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Wallet size={14} /> {session.user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total
            </p>
            <p className="text-2xl font-black text-indigo-600">
              ${totalMes.toLocaleString()}
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </header>

      <div className="card header-main">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Mi Panel Financiero</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Wallet size={14} /> {session.user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total
            </p>
            <p className="text-2xl font-black text-indigo-600">
              ${totalMes.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="font-bold mb-6 text-slate-700 uppercase text-xs tracking-wider">
            Flujo de Gastos Diarios
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBarras}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-6 text-slate-700 uppercase text-xs tracking-wider">
            Gastos por Categoría
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataTorta}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataTorta.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-700">Detalle de Movimientos</h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th className="text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {gastosRaw.map((g, i) => (
              <tr key={i}>
                <td className="text-sm text-slate-600">
                  {g.created_at.split("T")[0]}
                </td>
                <td>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-lg font-bold">
                    {g.category || "GENERAL"}
                  </span>
                </td>
                <td className="text-right font-bold text-slate-700">
                  ${Number(g.amount || g.monto).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
