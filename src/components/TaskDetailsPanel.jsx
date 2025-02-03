import "./../styles/taskDetailsPanel.css";

export default function TaskDetailsPanel({ task, onClose }) {
  return (
    <div className="task-details-panel">
      <button onClick={onClose} className="close-button">
        X
      </button>
      <div className="task-details-main">
        <h2>{task.text}</h2>
        <button className="add-step">+ Agregar paso</button>
        <textarea placeholder="Agregar nota" />
      </div>
      <button className="delete-btn">borrar</button>
    </div>
  );
}
