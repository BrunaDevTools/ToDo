import { FaSun, FaStar, FaList, FaDumbbell, FaBriefcase } from "react-icons/fa";
import { useCategories } from "../../../context/CategoriesContext";

const iconComponents = {
  FaSun,
  FaStar,
  FaList,
  FaDumbbell,
  FaBriefcase,
};

export default function CategoriesList({ categories, onCategoryClick }) {
  const { selectedCategory, setSelectedCategory } = useCategories();
  console.log("Categorías recibidas:", categories);
  return (
    <div>
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => {
          const IconComponent = iconComponents[category.icon];
          return (
            <li
              key={category.id}
              onClick={() => onCategoryClick(category)}
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
