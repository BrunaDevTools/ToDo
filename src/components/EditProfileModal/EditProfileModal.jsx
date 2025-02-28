import { useState } from "react";
import styles from "./EditProfileModal.module.css";

export default function EditProfileModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Guardar los cambios
  const handleSave = () => {
    if (!name) return; // Validación básica
    onSave({ name, avatar });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Profile</h2>

        {/* Campo para el nombre */}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo para la imagen */}
        <label className={styles.uploadLabel}>
          Choose Profile Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>

        {/* Vista previa de la imagen */}
        {avatar && (
          <img src={avatar} alt="Preview" className={styles.avatarPreview} />
        )}

        {/* Botones de acción */}
        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
