import styles from "./TaskDetailsPanel.module.css";

export default function TaskDetailsPanel({ task, onClose }) {
  return (
    <div className={styles.taskDetailsPanel}>
      <button onClick={onClose} className={styles.closeButton}>
        X
      </button>
      <div className={styles.taskDetailsMain}>
        <h2>{task.text}</h2>
        <button className={styles.addStep}>+ Agregar paso</button>
        <textarea placeholder="Agregar nota" />
      </div>
      <button className={styles.deleteBtn}>borrar</button>
    </div>
  );
}
