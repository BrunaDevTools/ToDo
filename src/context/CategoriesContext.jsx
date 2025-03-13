import { createContext, useContext, useState, useEffect } from "react";
import { FaSun, FaStar, FaList, FaDumbbell, FaBriefcase } from "react-icons/fa";

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories
      ? JSON.parse(savedCategories)
      : [
          { id: 1, name: "Mi día", icon: FaSun, fixed: true },
          { id: 2, name: "Importante", icon: FaStar, fixed: true },
          { id: 3, name: "Plan", icon: FaList, fixed: false },
          { id: 4, name: "Rutina del Gym", icon: FaDumbbell, fixed: false },
        ];
  });

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
