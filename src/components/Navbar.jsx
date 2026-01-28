import { useState } from "react";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <div className="dashboard-container">
        <Logo />
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
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
}
