import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App/App.jsx";
import "./styles/global.css";
import "./styles/vars.css";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CategoriesProvider>
        <TasksProvider>
          <NotesProvider>
            <App />
          </NotesProvider>
        </TasksProvider>
      </CategoriesProvider>
    </UserProvider>
  </StrictMode>
);
