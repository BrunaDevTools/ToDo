import styles from "./SearchBar.module.css";
import { LiaSearchSolid } from "react-icons/lia";

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <LiaSearchSolid className={styles.searchIcon} />
    </div>
  );
}
