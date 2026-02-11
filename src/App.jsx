import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// COMPONENTES / PÁGINAS
import { Dashboard } from "./pages/Dashboard";
import { Detalle } from "./components/Detalle";
import { Papelera } from "./pages/Papelera";
import { Seguridad } from "./pages/Seguridad";
import { Descargas } from "./pages/Descargas";
import Login from "./pages/Login";
import { Loading } from "./components/Loading";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";

// ESTILOS (Solo los globales aquí)
import "./index.css";
import "./styles/add_transaction.css";
import "./styles/sidebar.css"; // Asegúrate de crear este CSS
import "./styles/navbar.css";
import "./styles/papelera.css";
import "./styles/seguridad.css";
import "./styles/detalle.css";
import "./styles/resumen_cards.css";

// Un sub-componente para envolver rutas protegidas
const PrivateLayout = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <Loading />;
  if (!session) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <div className="main-content">{children}</div>
      </div>
    </>
  );
};

function App() {
  const { session } = useAuth();
  return (
    <Routes>
      {/* RUTA RAÍZ: Si no hay sesión, ve la Landing. Si hay, va al Dashboard */}
      <Route
        path="/"
        element={!session ? <Landing /> : <Navigate to="/dashboard" />}
      />

      {/* RUTA PÚBLICA DE LOGIN */}
      <Route
        path="/login"
        element={!session ? <Login /> : <Navigate to="/dashboard" />}
      />

      {/* RUTAS PRIVADAS (Ahora Dashboard vive en /dashboard) */}
      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/detalle"
        element={
          <PrivateLayout>
            <Detalle />
          </PrivateLayout>
        }
      />
      <Route
        path="/descargas"
        element={
          <PrivateLayout>
            <Descargas />
          </PrivateLayout>
        }
      />
      <Route
        path="/papelera"
        element={
          <PrivateLayout>
            <Papelera />
          </PrivateLayout>
        }
      />
      <Route
        path="/seguridad"
        element={
          <PrivateLayout>
            <Seguridad />
          </PrivateLayout>
        }
      />

      {/* REDIRECCIÓN GLOBAL */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
