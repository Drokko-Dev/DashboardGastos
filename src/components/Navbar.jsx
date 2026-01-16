export function Navbar({ session, nickname }) {
  return (
    <header className="navbar">
      <div className="dashboard-container">
        <h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            className="icon icon-tabler icons-tabler-outline icon-tabler-coins"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M9 14c0 1.657 2.686 3 6 3s6-1.343 6-3-2.686-3-6-3-6 1.343-6 3" />
            <path d="M9 14v4c0 1.656 2.686 3 6 3s6-1.344 6-3v-4M3 6c0 1.072 1.144 2.062 3 2.598s4.144.536 6 0c1.856-.536 3-1.526 3-2.598 0-1.072-1.144-2.062-3-2.598s-4.144-.536-6 0C4.144 3.938 3 4.928 3 6" />
            <path d="M3 6v10c0 .888.772 1.45 2 2" />
            <path d="M3 11c0 .888.772 1.45 2 2" />
          </svg>
          FinanceTracker
        </h1>

        <div className="profileIcon">
          <div className="profile-container">
            <span className="profile-name">{nickname || "Usuario"}</span>
            <span className="profile-email">{session.user.email}</span>
            <img className="profile-img" src="./banana.png" alt="Avatar" />
          </div>
          <button
            className="btn-logout"
            onClick={() => supabase.auth.signOut()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
              <path d="M9 12h12l-3-3M18 15l3-3" />
            </svg>{" "}
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
