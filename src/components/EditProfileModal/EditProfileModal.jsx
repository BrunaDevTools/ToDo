import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // Estilos de la librería
import styles from "./EditProfileModal.module.css";

export default function EditProfileModal({
  onClose,
  onSave,
  currentName,
  currentAvatar,
}) {
  const [name, setName] = useState(currentName);
  const [src, setSrc] = useState(null); // Imagen original
  const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Recorte cuadrado
  const [croppedImage, setCroppedImage] = useState(currentAvatar); // Imagen recortada
  const imgRef = useRef(null);

  // Manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Aplicar el recorte
  const handleCropComplete = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImage(croppedImageUrl);
    }
  };

  // Guardar los cambios
  const handleSave = () => {
    const updatedName = name.trim() !== "" ? name : currentName; // Si el nombre está vacío, mantiene el anterior
    const updatedAvatar = src ? croppedImage : currentAvatar; // Si no se subió imagen, mantiene la anterior

    onSave({ name: updatedName, avatar: updatedAvatar });
    onClose();
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
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
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

        {/* Vista previa de la imagen con recorte */}
        {src && (
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
