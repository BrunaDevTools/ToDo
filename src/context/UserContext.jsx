import { createContext, useState, useContext } from "react";

// Crear el contexto
const UserContext = createContext();

// Imagen por defecto
const defaultAvatar = "/default-avatar.png";

// Proveedor del contexto
export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || {
      name: "Usuario",
      avatar: defaultAvatar,
    }
  );

  // Función para actualizar el usuario
  const updateUserInfo = (newInfo) => {
    const updatedInfo = {
      name: newInfo.name || "Usuario",
      avatar: newInfo.avatar || defaultAvatar,
    };
    setUserInfo(updatedInfo);
    localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
  };

  // Función para resetear el usuario (solo para pruebas)
  const resetUserInfo = () => {
    setUserInfo({ name: "Usuario", avatar: defaultAvatar });
    localStorage.removeItem("userInfo");
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, resetUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useUser() {
  return useContext(UserContext);
}
