import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import { Detalle } from "./components/Detalle";
import Login from "./components/Login";
import "./index.css";
import "./styles/navbar.css";
import "./styles/logo.css";

const PrivateRoute = ({ children }) => {
  const { session, loading } = useAuth();

  // Si está cargando la sesión, mostramos un estado neutro
  if (loading)
    return (
      <div className="loading-container">
        <h2>Verificando...</h2>
      </div>
    );

  // Si no hay sesión después de cargar, al login
  return session ? children : <Navigate to="/login" />;
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          {/* Si escriben cualquier otra cosa, al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
