import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./styles/global.css";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { TasksProvider } from "./context/TasksContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CategoriesProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </CategoriesProvider>
  </StrictMode>
);
