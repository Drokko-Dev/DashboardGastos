export function Vinculacion({ session }) {
  const [inputID, setInputID] = useState("");
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

  <div className="dashboard-container flex items-center justify-center min-h-[70vh]">
    <div className="card max-w-md w-full text-center shadow-2xl border-t-4 border-indigo-500">
      <div className="bg-indigo-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <LinkIcon className="text-indigo-600" size={40} />
      </div>
      <h2 className="text-2xl font-black mb-4">Vincular Telegram</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Para ver tus gastos personalizados, pega aquí el ID que te dio el bot
        con el comando <span className="font-bold text-slate-800">/web</span>.
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
  </div>;
}
