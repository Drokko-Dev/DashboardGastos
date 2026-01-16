// src/pages/Transactions.jsx
export const Transactions = ({ gastos }) => (
  <div className="bg-[#1e293b] rounded-3xl border border-slate-700 overflow-hidden">
    <div className="p-6 border-b border-slate-700 flex justify-between items-center">
      <h3 className="font-bold text-xl">Log de Transacciones</h3>
      <button className="text-sm text-indigo-400 font-medium">Ver Todo</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-500 text-sm uppercase">
            <th className="p-6">Fecha</th>
            <th className="p-6">Descripción</th>
            <th className="p-6">Categoría</th>
            <th className="p-6 text-right">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {gastos.map((g) => (
            <tr key={g.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="p-6 text-sm">15 Ene</td>
              <td className="p-6 font-medium">{g.descripcion}</td>
              <td className="p-6">
                <span className="px-3 py-1 rounded-full bg-slate-700 text-xs text-slate-300">
                  {g.categoria}
                </span>
              </td>
              <td className="p-6 text-right font-mono font-bold text-white">
                ${g.monto.toLocaleString("es-CL")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
