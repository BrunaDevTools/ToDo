import { useCategories } from "../../../context/CategoriesContext";

export default function CategoriesList({
  categories,
  onCategoryClick,
  className,
}) {
  const { selectedCategory } = useCategories();

  return (
    <div className={className}>
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
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
            <span style={{ marginLeft: "10px" }}>{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
