import { Logo } from "./Logo";

export function Loading() {
  return (
    <div className="loading-container">
      <Logo />
      <h2>Cargando Perfil...</h2>
    </div>
  );
}
