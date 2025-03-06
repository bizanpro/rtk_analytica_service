import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./css/variables.css";
import "./css/index.css";

import App from "./components/App/App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
