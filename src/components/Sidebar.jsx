import SearchBar from "./SearchBar";
import UserName from "./UserName";
import CategoriesList from "./CategoriesList";
import TaskList from "./TaskList";

export default function Sidebar() {
  return (
    <>
      <UserName name="Bruna" avatar="./img/avatar.jpg" />
      <SearchBar />
      <CategoriesList />
      <TaskList />
    </>
  );
}
