import React from "react";
import {
  Utensils,
  Home as HomeIcon,
  Film,
  ShoppingCart,
  ArrowDownLeft,
  Wallet,
  Target,
  ShoppingBag,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Home = ({ gastos = [], totalMes = 0 }) => {
  // 1. Lógica para el Gráfico de Dona (Categorías)
  const dataPie = gastos.reduce((acc, g) => {
    const found = acc.find((item) => item.name === g.categoria);
    if (found) {
      found.value += g.monto;
    } else {
      acc.push({ name: g.categoria || "Otros", value: g.monto });
    }
    return acc;
  }, []);

  // 2. Lógica para el Gráfico de Tendencia (Últimos 7 movimientos)
  const dataLine = gastos.slice(-7).map((g) => ({
    fecha: new Date(g.created_at).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    }),
    monto: g.monto,
  }));

  const COLORS = ["#607AFB", "#37ec13", "#a1b99d", "#3f543b", "#2b3928"];

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* --- FILA 1: CARDS DE RESUMEN --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#121811] rounded-3xl p-6 border border-slate-200 dark:border-[#3f543b] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Balance Total</p>
            <div className="bg-[#607AFB]/10 p-2 rounded-xl text-[#607AFB]">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight">
            ${totalMes.toLocaleString("es-CL")}
          </p>
          <p className="text-[#37ec13] text-xs font-bold mt-2">
            +2.4%{" "}
            <span className="text-slate-400 font-normal">vs mes pasado</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#121811] rounded-3xl p-6 border border-slate-200 dark:border-[#3f543b] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">
              Gastos Mensuales
            </p>
            <div className="bg-red-500/10 p-2 rounded-xl text-red-500">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-sm font-black text-red-500">
            -${(g.monto || 0).toLocaleString("es-CL")}
          </p>
          <p className="text-red-500 text-xs font-bold mt-2">
            -12%{" "}
            <span className="text-slate-400 font-normal">
              por debajo del límite
            </span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#121811] rounded-3xl p-6 border border-slate-200 dark:border-[#3f543b] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-sm font-medium">Meta de Ahorro</p>
            <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
              <Target size={20} />
            </div>
          </div>
          <div className="space-y-3 mt-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Progreso Anual</span>
              <span className="text-[#607AFB]">62%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-[#2b3928] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#607AFB]"
                style={{ width: "62%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILA 2: GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Dona */}
        <div className="bg-white dark:bg-[#121811] rounded-3xl p-6 border border-slate-200 dark:border-[#3f543b]">
          <h3 className="text-lg font-bold mb-6">Gastos por Categoría</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121811",
                    border: "1px solid #3f543b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(val) => `$${val.toLocaleString("es-CL")}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Tendencia */}
        <div className="bg-white dark:bg-[#121811] rounded-3xl p-6 border border-slate-200 dark:border-[#3f543b]">
          <h3 className="text-lg font-bold mb-6">Tendencia (Últimos 7 días)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataLine}>
                <defs>
                  <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#37ec13" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#37ec13" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2b3928"
                  vertical={false}
                />
                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1b99d", fontSize: 10 }}
                />
                <Tooltip
                  formatter={(val) => `$${val.toLocaleString("es-CL")}`}
                />
                <Area
                  type="monotone"
                  dataKey="monto"
                  stroke="#37ec13"
                  strokeWidth={3}
                  fill="url(#colorMonto)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- FILA 3: TABLA DE TRANSACCIONES --- */}
      <div className="bg-white dark:bg-[#121811] rounded-3xl border border-slate-200 dark:border-[#3f543b] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-[#2b3928] flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Transacciones Recientes
          </h3>
          <button className="text-[#607AFB] text-sm font-bold px-4 py-2 rounded-xl bg-[#607AFB]/10 hover:bg-[#607AFB]/20 transition-colors">
            Ver Todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1a2517] text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-4">Detalle</th>
                <th className="px-8 py-4">Categoría</th>
                <th className="px-8 py-4">Fecha</th>
                <th className="px-8 py-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2b3928]">
              {gastos
                .slice(-5)
                .reverse()
                .map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-[#1a2517] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-slate-100 dark:bg-[#2b3928] rounded-xl flex items-center justify-center text-[#607AFB] group-hover:scale-110 transition-transform">
                          {g.categoria?.toLowerCase().includes("comida") ? (
                            <Utensils size={18} />
                          ) : g.categoria?.toLowerCase().includes("casa") ? (
                            <HomeIcon size={18} />
                          ) : (
                            <ShoppingCart size={18} />
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {g.descripcion || "Gasto Telegram"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 dark:bg-[#2b3928] px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-[#a1b99d]">
                        {g.categoria}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 dark:text-[#a1b99d]">
                      {new Date(g.created_at).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-black text-red-500">
                        -${g.monto.toLocaleString("es-CL")}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                        <ArrowDownLeft size={10} className="text-red-400" />
                        <span>Egreso</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
