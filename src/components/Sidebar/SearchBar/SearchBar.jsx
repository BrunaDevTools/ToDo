import styles from "./SearchBar.module.css";
import { LiaSearchSolid } from "react-icons/lia";

export default function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search..."
      />
      <LiaSearchSolid className={styles.searchIcon} />
    </div>
  );
}
