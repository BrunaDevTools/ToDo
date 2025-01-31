import "./../styles/SearchBar.css";
import { LiaSearchSolid } from "react-icons/lia";

export default function SearchBar() {
  return (
    <div className="search-container">
      <input className="search-input" type="text" placeholder="Search..." />
      <LiaSearchSolid className="search-icon" />
    </div>
  );
}
