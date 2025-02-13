import { useState } from "react";
import styles from "./ModalForm.module.css";

export default function ModalForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(inputValue);
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
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
          <div className={styles.modalButtons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.confirmBtn}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
