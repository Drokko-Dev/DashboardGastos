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

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function Dashboard({ session }) {
  const [gastosRaw, setGastosRaw] = useState([]);
  const [dataBarras, setDataBarras] = useState([]);
  const [dataTorta, setDataTorta] = useState([]);
  const [totalMes, setTotalMes] = useState(0);

  useEffect(() => {
    async function fetchExpenses() {
      // Nota: Aquí podrías filtrar por el ID de Telegram del usuario
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
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="card header-main">
        <div>
          <h1 className="text-3xl font-black">Mi Panel Financiero</h1>
          <p className="text-slate-500">
            Sesión iniciada como {session.user.email}
          </p>
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
            className="btn-primary"
            onClick={() => supabase.auth.signOut()}
          >
            Salir
          </button>
        </div>
      </header>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="font-bold mb-6 text-slate-700">
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
          <h3 className="font-bold mb-6 text-slate-700">
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
