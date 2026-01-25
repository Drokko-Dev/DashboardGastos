import { useState } from "react";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext"; // Importamos el hook global

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Extraemos todo directamente del contexto global
  const { session, nickname, role } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <div className="dashboard-container">
        <Logo />

        <div className="profileIcon">
          <div className="profile-container">
            <div className="profile-name">
              {/* Los datos aparecen instantáneamente sin parpadeo */}
              <span className="nickname">{nickname || "Usuario"} </span>
              {role === "admin" && <span className="roles">{role}</span>}
            </div>
            <span className="profile-email">{session?.user?.email}</span>
            <img className="profile-img" src="./banana.png" alt="Avatar" />
          </div>

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
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* El Sidebar también puede usar useAuth internamente si lo necesita */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
}
