import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      {!session ? (
        <Login />
      ) : (
        <div>
          {/* <h1>Bienvenido, {session.user.email}</h1> */}
          {/*  <button onClick={() => supabase.auth.signOut()}>Cerrar Sesión</button> */}
          <Dashboard session={session} />
        </div>
      )}
    </div>
  );
}

export default App;
