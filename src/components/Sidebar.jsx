import SearchBar from "./SearchBar";
import UserName from "./UserName";
import CategoriesList from "./CategoriesList";
import TaskList from "./TaskList";

export default function Sidebar({ onCategoryClick, onTaskClick }) {
  return (
    <>
      <div className="container">
        <UserName name="Bruna" avatar="./img/avatar.jpg" />
        <SearchBar />
        <CategoriesList onCategoryClick={onCategoryClick} />
        <TaskList onTaskClick={onTaskClick} />
      </div>
    </>
  );
}
