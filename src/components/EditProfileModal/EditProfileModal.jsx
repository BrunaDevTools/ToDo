import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./EditProfileModal.module.css";

export default function EditProfileModal({
  onClose,
  onSave,
  currentName,
  currentAvatar,
}) {
  const [name, setName] = useState(currentName);
  const [src, setSrc] = useState(null); // Imagen original
  const [selectedImage, setSelectedImage] = useState(null); // Guarda la imagen seleccionada
  const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Recorte cuadrado
  const [croppedImage, setCroppedImage] = useState(currentAvatar); // Imagen final guardada
  const imgRef = useRef(null);
  const [originalAvatar] = useState(currentAvatar); // Guarda la imagen original

  // Manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result);
        setSelectedImage(reader.result); // Guardar la imagen seleccionada
        setCroppedImage(null); // Reiniciar la imagen recortada
      };
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
    const updatedName = name.trim() !== "" ? name : currentName;
    const updatedAvatar = croppedImage || selectedImage || currentAvatar; // Usa recorte si existe, sino imagen subida, sino mantiene la actual

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

  // Si el usuario cancela, se cierra el modal y se mantiene la información original
  const closeModal = () => {
    setSrc(null); // Borra la imagen subida
    setSelectedImage(null); // Borra la imagen seleccionada
    setCroppedImage(null); // Mantiene la imagen original
    setName(currentName); // Mantiene el nombre original
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
          <div className={styles.cropContainer}>
            <p>
              Ajusta la imagen dentro del área de recorte y luego guarda los
              cambios.
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
          </div>
        )}

        {/* Botones de acción */}
        <div className={styles.modalActions}>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
