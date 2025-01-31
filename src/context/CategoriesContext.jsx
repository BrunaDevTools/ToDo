import { createContext, useContext, useState, useEffect } from "react";
import { FaSun, FaStar, FaList, FaDumbbell, FaBriefcase } from "react-icons/fa";

const CategoriesContext = createContext();

const defaultCategories = [
  { id: 1, name: "My day", icon: "FaSun", fixed: true },
  { id: 2, name: "Important", icon: "FaStar", fixed: true },
  { id: 3, name: "Plan", icon: "FaList", fixed: false },
  { id: 4, name: "Gym routine", icon: "FaDumbbell", fixed: false },
  { id: 5, name: "Work", icon: "FaBriefcase", fixed: false },
];

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? categories[0] : null
  );

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

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
