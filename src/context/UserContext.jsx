import { createContext, useState, useContext } from "react";

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || { name: "", avatar: "" }
  );

  // Función para actualizar el usuario
  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
    localStorage.setItem("userInfo", JSON.stringify(newInfo));
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useUser() {
  return useContext(UserContext);
}
