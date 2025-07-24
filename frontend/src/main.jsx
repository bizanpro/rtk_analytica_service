import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/reset.scss";
import "./styles/variables.scss";
import "./styles/connected-fonts.scss";
import "./styles/index.css";
import "./styles/form.scss";
import "./styles/main.scss";

import App from "./components/App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
