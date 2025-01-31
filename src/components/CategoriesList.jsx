import { FaSun, FaStar, FaList, FaDumbbell, FaBriefcase } from "react-icons/fa";

const iconComponents = {
  FaSun,
  FaStar,
  FaList,
  FaDumbbell,
  FaBriefcase,
};
import { useCategories } from "../context/CategoriesContext";

export default function CategoriesList() {
  const { categories, selectedCategory, setSelectedCategory } = useCategories();

  return (
    <div>
      <ul>
        {categories.map((category) => {
          const IconComponent = iconComponents[category.icon];
          return (
            <li
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedCategory && selectedCategory.id === category.id
                    ? "#e0e0e0"
                    : "transparent",
                borderLeft:
                  selectedCategory && selectedCategory.id === category.id
                    ? "4px solid #01b0c4"
                    : "none",
              }}
            >
              <span>{IconComponent && <IconComponent />}</span>
              <span style={{ marginLeft: "10px" }}>{category.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
