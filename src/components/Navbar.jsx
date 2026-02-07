import { useState } from "react";
import { Link } from "react-router-dom"; // Importante para la navegación
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const { refreshGastos, loadingGastos } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleRefresh = async () => {
    await refreshGastos();
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
  };

  return (
    <header className="navbar">
      <div className="dashboard-container">
        {/* ENVOLVEMOS EL LOGO CON UN LINK A LA RAÍZ */}
        <Link
          className="logo-link"
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Logo />
        </Link>

        <div
          className="navbar-right-actions"
          style={{ display: "flex", alignItems: "center", gap: "15px" }}
        >
          {/* Botón de Refresco con feedback visual (Check ✅) */}
          <button
            className={`btn-refresh ${loadingGastos ? "spinning" : ""}`}
            onClick={handleRefresh}
            disabled={loadingGastos || showCheck}
            style={{
              background: "none",
              border: "none",
              color: showCheck
                ? "#36d35d"
                : loadingGastos
                  ? "#08afbe"
                  : "#94a3b8",
              cursor: "pointer",
              display: "flex",
              padding: "5px",
              transition: "color 0.3s ease",
            }}
          >
            {showCheck ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5l10 -10" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            )}
          </button>

          <button className="hamburger" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={30}
              height={30}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          </button>
        </div>
      </div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
}
