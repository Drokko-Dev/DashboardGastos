import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Plus, Calendar, Target, History, Edit2, X, Check } from "lucide-react";
import { CicloSheet } from "./CicloSheet";
import "../../styles/pages/Ciclos/ciclos.css";

const Ciclos = () => {
  // 1. Usamos los estados globales. 'loadingCiclos' reemplaza a tu 'loading' local
  const {
    session,
    showToast,
    refreshUserProfile,
    ciclos,
    loadingCiclos,
    fetchCiclos
  } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [presupuesto, setPresupuesto] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  async function handleCrearNuevoCiclo() {
    const montoNumerico = Number(presupuesto);
    if (!nombre || !presupuesto || isNaN(montoNumerico) || montoNumerico <= 0) {
      showToast("⚠️ Datos inválidos", "error");
      return;
    }

    try {
      const ahoraISO = new Date().toISOString();

      // Buscamos el ciclo activo del perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_cycle_id")
        .eq("id", session.user.id)
        .single();

      if (profile?.current_cycle_id) {
        await supabase
          .from("ciclos")
          .update({ is_active: false, end_date: ahoraISO })
          .eq("id", profile.current_cycle_id);
      }

      const { data: nuevoCiclo, error: errC } = await supabase
        .from("ciclos")
        .insert([
          {
            user_id: session.user.id,
            name: nombre.trim(),
            budget: montoNumerico,
            start_date: ahoraISO,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (errC) throw errC;

      await supabase
        .from("profiles")
        .update({ current_cycle_id: nuevoCiclo.id })
        .eq("id", session.user.id);

      showToast("¡Nuevo ciclo iniciado! 🚀", "success");

      setShowModal(false);
      setNombre("");
      setPresupuesto("");

      // 2. IMPORTANTE: Refrescamos ambos globalmente
      await fetchCiclos();
      if (refreshUserProfile) await refreshUserProfile();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  }

  async function handleUpdateCiclo(id, updates) {
    try {
      const { error } = await supabase
        .from("ciclos")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      showToast("Ciclo actualizado ✅", "success");

      // 3. Refrescamos para que el cambio se vea en todas las páginas
      await fetchCiclos();
      if (refreshUserProfile) await refreshUserProfile();
    } catch (err) {
      showToast("Error al actualizar", "error");
    }
  }

  return (
    <div className="ciclos-container">
      <div className="ciclos-header">
        <h1 className="ciclos-title">
          <History className="icon-blue" /> Gestión de Ciclos
        </h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Nuevo Ciclo
        </button>
      </div>

      {/* 4. Usamos loadingCiclos del Contexto */}
      {loadingCiclos && ciclos.length === 0 ? (
        <p className="loading-text">Cargando historial...</p>
      ) : (
        <div className="ciclos-grid">
          {ciclos.map((ciclo) => (
            <div
              key={ciclo.id}
              className={`ciclo-card ${ciclo.is_active ? "active" : ""}`}
            >
              <div className="ciclo-card-header">
                <div className="ciclo-info-main">
                  <h3>{ciclo.name}</h3>
                  <div className="ciclo-date">
                    <Calendar size={14} />
                    <span>
                      {new Date(ciclo.start_date).toLocaleDateString()} -
                      {ciclo.end_date
                        ? new Date(ciclo.end_date).toLocaleDateString()
                        : " Presente"}
                    </span>
                  </div>
                </div>
                {ciclo.is_active && (
                  <span className="badge-active">ACTIVO</span>
                )}
              </div>

              <div className="ciclo-card-body">
                <div className="budget-section">
                  <label className="budget-label">Presupuesto Meta</label>

                  {editingId === ciclo.id ? (
                    <div className="username-edit-row">
                      <Target size={16} className="icon-blue" />
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        className="username-edit-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateCiclo(ciclo.id, { budget: Number(editValue) });
                            setEditingId(null);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button className="username-edit-btn save" onClick={() => {
                        handleUpdateCiclo(ciclo.id, { budget: Number(editValue) });
                        setEditingId(null);
                      }}>
                        <Check size={16} />
                      </button>
                      <button className="username-edit-btn cancel" onClick={() => setEditingId(null)}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="username-display-row">
                      <Target size={16} className="icon-blue" />
                      <span className="budget-value">
                        ${ciclo.budget?.toLocaleString("es-CL")}
                      </span>
                      <button
                        className="username-edit-trigger"
                        onClick={() => {
                          setEditingId(ciclo.id);
                          setEditValue(ciclo.budget);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Modal Limpio de Tailwind (Asegúrate de tener estos estilos en el CSS) */}
      <CicloSheet
        show={showModal}
        onClose={() => setShowModal(false)}
        nombre={nombre}
        setNombre={setNombre}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        onSave={handleCrearNuevoCiclo}
      />
    </div>
  );
};

export default Ciclos;
