// src/pages/Insights.jsx
export const Insights = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
      <div className="z-10 relative">
        <h3 className="text-2xl font-bold mb-4">Brújula Financiera</h3>
        <p className="text-slate-400 mb-6">
          Has gastado un 15% menos que el promedio de tus amigos en esta
          categoría.
        </p>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-indigo-400">37%</div>
          <p className="text-sm text-slate-500 leading-tight">
            Potencial de ahorro mensual detectado
          </p>
        </div>
      </div>
      {/* Círculo decorativo de fondo */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
    </div>

    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700">
      <h3 className="font-bold mb-4">Proyección a Final de Mes</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Gastado hoy</span>
          <span className="font-bold">$450.000</span>
        </div>
        <div className="flex justify-between text-sm text-orange-400">
          <span>Predicción cierre</span>
          <span className="font-bold">$620.000</span>
        </div>
        <p className="text-xs text-slate-500 pt-4 border-t border-slate-700">
          *Basado en tu frecuencia de gastos en Telegram durante los últimos 7
          días.
        </p>
      </div>
    </div>
  </div>
);
