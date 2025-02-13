import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App/App.jsx";
import "./styles/global.css";
import "./styles/vars.css";
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
