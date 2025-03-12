import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./SetupScreen.module.css";
import { useUser } from "../../context/UserContext";

const defaultAvatar = "/avatars.png"; // Imagen por defecto

export default function SetupScreen({ onComplete }) {
  const { updateUserInfo } = useUser();
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [src, setSrc] = useState(null); // Imagen original subida
  const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Recorte cuadrado
  const [croppedImage, setCroppedImage] = useState(null); // Imagen recortada
  const [isCropModalOpen, setIsCropModalOpen] = useState(false); // Estado para el modal
  const imgRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null); // Estado para almacenar la imagen original

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result);
        setOriginalImage(reader.result); // Guardar la imagen origianl
        setIsCropModalOpen(true); // Abrir el modal
      };
      reader.readAsDataURL(file);
    }
  };

  // Aplicar el recorte de la imagen
  const handleCropComplete = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImage(croppedImageUrl);
    }
  };

  // Función para obtener la imagen recortada
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  // Guardar los datos
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: userName.trim() || "Usuario",
      avatar: croppedImage || defaultAvatar, // Usa la imagen recortada o la por defecto
    };
    updateUserInfo(newUser);
    onComplete(newUser);
  };

  const closeModal = () => {
    if (!croppedImage) {
      setCroppedImage(originalImage); // Usar la imagen original si no se recortó
    }
    setIsCropModalOpen(false);
  };

  return (
    <div className={styles.containerInicio}>
      <span className={styles.logoBM}>
        <img src="/bmlogo.png" alt="logo" />
      </span>
      <div className={styles.setupContainer}>
        <h1>TaskNotes</h1>

        <form onSubmit={handleSubmit} className={styles.setupForm}>
          <img
            src={croppedImage || defaultAvatar}
            alt="Preview"
            className={styles.avatarPreview}
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

          {/* Input para el nombre */}
          <input
            type="text"
            placeholder="Enter your name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <button className={styles.btnContinue} type="submit">
            Continue
          </button>
        </form>
      </div>

      {/* Modal para el área de recorte */}
      {isCropModalOpen && (
        <div className={styles.cropModal}>
          <div className={styles.cropModalContent}>
            <p className={styles.cropInstruction}>
              Ajusta la imagen dentro del área de recorte y luego cierra esta
              ventana.
            </p>
            <ReactCrop
              src={src}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
            >
              <img
                ref={imgRef}
                src={src}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            </ReactCrop>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
