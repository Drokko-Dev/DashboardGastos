import { PlusIcon } from "@heroicons/react/24/outline";

export function AddTransactionButton({ onClick }) {
  return (
    <button className="fab-button" onClick={onClick}>
      <PlusIcon className="w-6 h-6 text-white" />
      <span className="fab-text">Nuevo</span>
    </button>
  );
}
