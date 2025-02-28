import { useState } from "react";
import styles from "./SetupScreen.module.css";
import { useUser } from "../../context/UserContext";

const defaultAvatar = "/default-avatar.png"; // Imagen por defecto

export default function SetupScreen({ onComplete }) {
  const { updateUserInfo } = useUser();
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: userName.trim() || "Usuario",
      avatar: avatar || defaultAvatar,
    };
    updateUserInfo(newUser);
    onComplete(newUser);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.setupContainer}>
      <h1>Welcome to TaskNotes</h1>
      <form onSubmit={handleSubmit} className={styles.setupForm}>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label className={styles.avatarUpload}>
          Choose Profile Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>
        <img
          src={avatar || defaultAvatar}
          alt="Preview"
          className={styles.avatarPreview}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
