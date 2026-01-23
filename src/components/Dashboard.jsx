import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importamos el nuevo contexto
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
  LabelList,
} from "recharts";
import { Link as LinkIcon } from "lucide-react";
import { Navbar } from "./Navbar";
import { ResumenCards } from "./ResumenCards";
import { Loading } from "./Loading";

const CATEGORY_COLORS = {
  Alimentos: "#bbd83a",
  Transporte: "#F59E0B",
  Hogar: "#EC4899",
  Salud: "#1fce7c",
  Ocio: "#8B5CF6",
  Mascotas: "#0bc5e6",
  Compras: "#a8dbdb",
  Fijos: "#6366F1",
  Otros: "#697fa193",
  Ingreso: "#22C55E",
};

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

export default function Dashboard() {
  const { session } = useAuth(); // Obtenemos la sesión global

  // Estados de datos
  const [gastosRaw, setGastosRaw] = useState([]);
  const [dataBarras, setDataBarras] = useState([]);
  const [dataTorta, setDataTorta] = useState([]);
  const [totalMesGasto, setTotalMesGasto] = useState(0);
  const [totalMesIngreso, setTotalMesIngreso] = useState(0);

  // Estados de perfil y UI
  const [telegramId, setTelegramId] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [role, setRole] = useState(null);
  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const añoHoy = new Date().getFullYear();

  const [privateStates, setPrivateStates] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("privacySettings"));
    return saved || { total: false, gasto: false, ingreso: false };
  });

  useEffect(() => {
    localStorage.setItem("privacySettings", JSON.stringify(privateStates));
  }, [privateStates]);

  const togglePrivacy = (key) => {
    setPrivateStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (session?.user) {
      checkUserLink();
    }
  }, [session]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function checkUserLink() {
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id_telegram")
        .eq("auth_id", session.user.id)
        .maybeSingle();

      if (profile?.id_telegram) {
        setTelegramId(profile.id_telegram);
        const { data: userData } = await supabase
          .from("users")
          .select("full_name, role")
          .eq("id_telegram", profile.id_telegram)
          .maybeSingle();

        if (userData) {
          setNickname(userData.full_name);
          setRole(userData.role);
        }
        await fetchExpenses();
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchExpenses() {
    const { data: gastos, error } = await supabase
      .from("gastos")
      .select("*")
      .is("deleted_at", null) // Solo traemos los que NO están eliminados
      .order("created_at", { ascending: false });

    if (!error && gastos) {
      setGastosRaw(gastos);
      processChartData(gastos);
    }
  }

  function processChartData(gastos) {
    // Cálculo de Totales
    const sumaG = gastos
      .filter((g) => g.type === "gasto")
      .reduce((acc, g) => acc + Number(g.amount || g.monto || 0), 0);
    const sumaI = gastos
      .filter((g) => g.type === "ingreso")
      .reduce((acc, i) => acc + Number(i.amount || i.monto || 0), 0);
    setTotalMesGasto(sumaG);
    setTotalMesIngreso(sumaI);

    // Datos para Torta
    const porCat = gastos
      .filter((g) => g.type === "gasto")
      .reduce((acc, g) => {
        const c = g.category || "Otros";
        acc[c] = (acc[c] || 0) + Number(g.amount || g.monto || 0);
        return acc;
      }, {});
    setDataTorta(
      Object.keys(porCat).map((c) => ({ name: c, value: porCat[c] })),
    );
  }

  // Lógica de procesamiento de meses para el gráfico de barras
  const infoGrafico = (gastosRaw || []).reduce(
    (acc, g) => {
      const fecha = new Date(g.created_at);
      if (fecha.getFullYear() === añoHoy) {
        const mesNum = fecha.getMonth() + 1;
        const existe = acc.resultados.find((item) => item.mes === mesNum);
        if (existe) existe.total += Number(g.amount || g.monto || 0);
        else
          acc.resultados.push({
            mes: mesNum,
            mesNombre: NOMBRES_MESES[mesNum],
            total: Number(g.amount || g.monto || 0),
          });
      }
      return acc;
    },
    { resultados: [] },
  );

  const dataLineas = infoGrafico.resultados.sort((a, b) => a.mes - b.mes);

  async function handleLink() {
    if (!inputID) return alert("Por favor ingresa tu ID");
    const { error } = await supabase
      .from("profiles")
      .insert([{ auth_id: session.user.id, id_telegram: inputID }]);
    if (!error) {
      setTelegramId(inputID);
      fetchExpenses();
    } else alert("Error: " + error.message);
  }

  if (loading) return <Loading />;

  if (!telegramId)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="card max-w-md w-full text-center shadow-2xl border-t-4 border-indigo-500 p-8">
          <LinkIcon className="text-indigo-600 mx-auto mb-6" size={40} />
          <h2 className="text-2xl font-black mb-4">Vincular Telegram</h2>
          <input
            type="text"
            value={inputID}
            onChange={(e) => setInputID(e.target.value)}
            placeholder="Pega tu ID aquí..."
            className="w-full p-4 border-2 rounded-2xl mb-6 text-center text-xl outline-none"
          />
          <button
            onClick={handleLink}
            className="btn-primary w-full py-4 text-lg"
          >
            Comenzar
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="resumen-container">
        <ResumenCards
          // Lógica de visualización individual
          totalMes={
            privateStates.total
              ? "********"
              : (totalMesIngreso - totalMesGasto).toLocaleString("es-CL")
          }
          gastoMes={
            privateStates.gasto
              ? "********"
              : totalMesGasto.toLocaleString("es-CL")
          }
          ahorroMes={
            privateStates.ingreso
              ? "********"
              : totalMesIngreso.toLocaleString("es-CL")
          }
          // Props nuevas para los ojos
          states={privateStates}
          onToggle={togglePrivacy}
        />

        <div className="charts-grid">
          {/* Gráfico de Torta: Gastos por Categoría */}
          <div className="chart-card cake">
            <div className="chart-header">
              <h2>Gastos por Categoría</h2>
              <p>Distribución mensual</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <pattern
                      id="pattern-diagonal"
                      width="4"
                      height="4"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <rect width="2" height="4" fill="#94A3B8" />{" "}
                      {/* El color de "Otros" */}
                    </pattern>
                  </defs>
                  <Pie
                    data={dataTorta}
                    cx="50%" /* Centrado horizontal exacto */
                    cy="50%" /* Centrado vertical exacto */
                    innerRadius={75} /* Radio interno */
                    outerRadius={110} /* Radio externo */
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataTorta.map((entry, index) => {
                      const esOtros = entry.name === "Otros";
                      return (
                        <Cell
                          key={`cell-${index}`}
                          /* Mantenemos el patrón para la rebanada de la torta */
                          fill={
                            esOtros
                              ? "url(#pattern-diagonal)"
                              : CATEGORY_COLORS[entry.name] || "#ccc"
                          }
                          stroke={esOtros ? "#94A3B8" : "none"}
                        />
                      );
                    })}
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
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    align="center"
                    layout="horizontal" // Asegura que se comporte como bloque horizontal
                    wrapperStyle={{
                      width: "100%",

                      // Fuerza el ancho total para evitar desbordamiento lateral
                      // Saca la leyenda del cálculo de posición absoluta del SVG
                    }}
                    formatter={(value) => {
                      // Si la categoría es "Otros", forzamos el color gris de tu paleta
                      const esOtros = value === "Otros";
                      const colorTexto = esOtros
                        ? "#94A3B8"
                        : CATEGORY_COLORS[value] || "#94a3b8";

                      return (
                        <span
                          className="legend-cake"
                          style={{
                            color: colorTexto,
                            fontSize: "15px",
                            fontWeight: esOtros ? "bold" : "normal",
                            marginLeft: "2px",
                          }}
                        >
                          {value}
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aquí puedes agregar un segundo gráfico (ej: Barras) en el futuro */}
          <div className="chart-card">
            <div className="chart-header">
              {/* Usamos el año extraído en el título */}
              <h2 style={{ color: "#ffffff" }}>Tendencia de Gastos {añoHoy}</h2>
              <p style={{ color: "#94a3b8" }}>Meses del año (1-12)</p>
            </div>

            <div className="chart-content ">
              <ResponsiveContainer width="100%" height="100%">
                {isMobile ? (
                  /* VISTA CELULAR: Barras Horizontales */
                  <BarChart
                    data={dataLineas}
                    layout="vertical"
                    margin={{ left: 5, right: 30, top: 20, bottom: 20 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="mesNombre"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={12}
                      width={70} // Aumentamos de 30 a 70 para que "Enero", "Febrero" quepan bien
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={25}>
                      <LabelList
                        dataKey="total"
                        activeBar={false}
                        content={(props) => {
                          const { x, y, width, value, viewBox } = props;
                          // Definimos un umbral: si la barra mide menos de 80px, ponemos el texto afuera
                          const positionX =
                            width > 80 ? x + width - 10 : x + width + 10;
                          const textAnchor = width > 80 ? "end" : "start";
                          const textColor = width > 80 ? "#ffffff" : "#94a3b8";

                          return (
                            <text
                              x={positionX}
                              y={
                                y + 14
                              } /* Ajuste vertical para centrar en la barra */
                              fill={textColor}
                              fontSize={11}
                              fontWeight="bold"
                              textAnchor={textAnchor}
                            >
                              {`$${value.toLocaleString("es-CL")}`}
                            </text>
                          );
                        }}
                      />
                      {dataLineas.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.mes === new Date().getMonth() + 1
                              ? "#006D77"
                              : "#334155"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  /* VISTA WEB: Gráfico de Líneas */
                  <BarChart
                    data={dataLineas}
                    layout="horizontal" /* Cambiamos a horizontal para barras verticales */
                    margin={{ top: 15, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#2e2e2e"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="mesNombre"
                      stroke="#a6c0e5"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-45}
                      height={36}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `$${value.toLocaleString("es-CL")}`
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255, 255, 255, 0.015)" }}
                      contentStyle={{
                        backgroundColor: "#2e2e2e",
                        border: "1px solid #00000034",
                        color: "#f3f3f3",
                        borderRadius: "12px",
                      }}
                      itemStyle={{ color: "#f3f3f3" }}
                      formatter={(value) => `$${value.toLocaleString("es-CL")}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="#006D77"
                      radius={[
                        6, 6, 0, 0,
                      ]} /* Redondeamos solo las esquinas superiores */
                      barSize={40}
                    >
                      {dataLineas.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          /* Resaltamos el mes actual (Enero) con tu Teal principal */
                          fill={
                            entry.mes === new Date().getMonth() + 1
                              ? "#006D77"
                              : "#334155"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <section className="tickets">
          <div className="tickets-header">
            <h1 className="tituloGastos">Últimos Movimientos</h1>
            <Link to="/detalle">
              <button className="tickets-button btn-detalle">Detalle</button>
            </Link>
          </div>
          <div className="header">
            <h1>Fecha</h1>
            <h1>Descripcion</h1>
            <h1>Categoría</h1>
            <h1>Monto</h1>
          </div>
          <div className="ticket">
            {gastosRaw.slice(0, 10).map((g, i) => {
              // Obtenemos el color dinámico. Si no existe, usamos un gris por defecto.
              const categoriaColor = CATEGORY_COLORS[g.category] || "#94a3b8";

              return (
                <article className="ticket-card" key={g.id}>
                  <p className="fecha-registro">
                    {g.created_at.replace("T", " ").slice(0, 16)}
                  </p>
                  <p className="descripcion-texto">
                    {g.description_user || "Sin descripción"}
                  </p>

                  {/* APLICACIÓN DE COLORES DINÁMICOS */}
                  <h2
                    className={`category ${g.category}`}
                    style={{
                      color: categoriaColor,
                      borderColor: categoriaColor,
                      opacity: 0.85,
                      backgroundColor: `${categoriaColor}25`, // 15 añade un 8% de opacidad para el fondo
                    }}
                  >
                    {g.category || "GENERAL"}
                  </h2>

                  <span
                    style={{
                      color: g.type === "gasto" ? "#ef4444" : "#36d35d",
                    }}
                  >
                    ${Number(g.amount || g.monto).toLocaleString("es-CL")}
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
