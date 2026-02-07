import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// COMPONENTES
import Dashboard from "./components/Dashboard";
import { Detalle } from "./components/Detalle";
import { Papelera } from "./components/Papelera"; // Nueva
import { Seguridad } from "./components/Seguridad"; // Nueva
import Login from "./components/Login";
import { Sidebar } from "./components/Sidebar"; // El nuevo Sidebar
import { Loading } from "./components/Loading";
import { Descargas } from "./components/Descargas";

// ESTILOS
import "./index.css";
import "./styles/add_transaction.css";
import "./styles/sidebar.css"; // Asegúrate de crear este CSS
import "./styles/navbar.css";
import "./styles/papelera.css";
import "./styles/seguridad.css";
import "./styles/detalle.css";
import "./styles/resumen_cards.css";
import { Navbar } from "./components/Navbar";

// COMPONENTE DE RUTA PRIVADA
const PrivateRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <Loading />;

  return session ? (
    <>
      {" "}
      <Navbar />
      <div className="app-layout">
        {/* El Navbar queda arriba de todo o dentro del contenido, según tu diseño */}
        {/* <Sidebar /> */}

        {/* <--- LO LLAMAS AQUÍ UNA SOLA VEZ */}
        <div className="main-content">{children}</div>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/login" element={<Login />} />

          {/* RUTAS PRIVADAS (Todas usan PrivateRoute + Sidebar) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/detalle"
            element={
              <PrivateRoute>
                <Detalle />
              </PrivateRoute>
            }
          />

          <Route
            path="/descargas"
            element={
              <PrivateRoute>
                <Descargas />
              </PrivateRoute>
            }
          />

          <Route
            path="/papelera"
            element={
              <PrivateRoute>
                <Papelera />
              </PrivateRoute>
            }
          />

          <Route
            path="/seguridad"
            element={
              <PrivateRoute>
                <Seguridad />
              </PrivateRoute>
            }
          />

          {/* REDIRECCIÓN GLOBAL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
