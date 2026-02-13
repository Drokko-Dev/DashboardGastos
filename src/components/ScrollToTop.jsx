import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esto fuerza al navegador a ir arriba cada vez que cambia la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
