import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// COMPONENTES / PÁGINAS
import { Dashboard } from "./pages/Dashboard";
import { Detalle } from "./components/Detalle";
import { Papelera } from "./pages/Papelera";
import { Seguridad } from "./pages/Seguridad";
import { Descargas } from "./pages/Descargas";
import Login from "./pages/Login";
import { Loading } from "./components/Loading";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing/Landing";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { ScrollToTop } from "./components/ScrollToTop";
import { Ayuda } from "./pages/Sidebar/Ayuda";
import { GuiaUso } from "./pages/Sidebar/GuiaUso";
// ESTILOS (Solo los globales aquí)
import "./index.css";
import "./styles/add_transaction.css";
import "./styles/sidebar.css"; // Asegúrate de crear este CSS
import "./styles/navbar.css";
import "./styles/papelera.css";
import "./styles/seguridad.css";
import "./styles/detalle.css";
import "./styles/resumen_cards.css";
import { SobreNosotros } from "./pages/Landing/SobreNosotros";
import { PublicLayout } from "./pages/Landing/PublicLayout";
import { Terms } from "./pages/Landing/Terms";
import { Soporte } from "./pages/Landing/Soporte";

// Un sub-componente para envolver rutas protegidas
const PrivateLayout = ({ children }) => {
  const { session, loading } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    // Solo reseteamos el scroll de la ventana global y el contenedor
    // Este efecto solo se dispara cuando el STRING de pathname cambia.
    window.scrollTo(0, 0);

    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]); // <--- Pathname es un string, abrir el sidebar no lo cambia.

  if (loading) return <Loading />;
  if (!session) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <div className="app-layout">
        {/* IMPORTANTE: Quitamos la 'key={pathname}' del <main> si estaba causando 
            que todo el componente se destruyera al abrir el sidebar */}
        <main className="main-content">{children}</main>
      </div>
    </>
  );
};

function App() {
  const { session } = useAuth();
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* RUTA RAÍZ: Si no hay sesión, ve la Landing. Si hay, va al Dashboard */}
        <Route
          path="/"
          element={
            !session ? (
              <PublicLayout>
                <Landing />
              </PublicLayout>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/sobre-nosotros"
          element={
            <PublicLayout>
              <SobreNosotros />
            </PublicLayout>
          }
        />
        <Route
          path="/terminos-y-condiciones"
          element={
            <PublicLayout>
              <Terms />
            </PublicLayout>
          }
        />

        <Route
          path="/soporte"
          element={
            <PublicLayout>
              <Soporte />
            </PublicLayout>
          }
        />

        {/* RUTA PÚBLICA DE LOGIN */}
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/signup"
          element={!session ? <SignUp /> : <Navigate to="/dashboard" />}
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
        {/* <Route path="/dashboard" element={<Landing />} /> */}
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
        <Route
          path="/profile"
          element={
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
          }
        />
        <Route
          path="/ayuda"
          element={
            <PrivateLayout>
              <Ayuda />
            </PrivateLayout>
          }
        />
        <Route
          path="/privacidad-config"
          element={
            <PrivateLayout>
              <Terms /> {/* Reutilizamos el mismo componente */}
            </PrivateLayout>
          }
        />

        <Route
          path="/guia-uso"
          element={
            <PrivateLayout>
              <GuiaUso />
            </PrivateLayout>
          }
        />

        {/* REDIRECCIÓN GLOBAL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
