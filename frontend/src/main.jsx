import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import "./assets/css/reset.css";
import "./assets/css/variables.css";
import "./assets/css/index.css";

import App from "./assets/components/App/App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
