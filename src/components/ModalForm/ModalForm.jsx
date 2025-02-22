import { useState } from "react";
import styles from "./ModalForm.module.css";

export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  showInput = true, // Por defecto, mostrar el input
}) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(showInput ? inputValue : null); // Pasar el valor solo si showInput es true
      setInputValue("");
      onClose();
    } else {
      console.error("ERROR: onSubmit no es una funcion");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          {showInput && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className={styles.modalButtons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.confirmBtn}>
              {title.includes("Eliminar") ? "Eliminar" : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
