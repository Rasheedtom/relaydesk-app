import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/queue.css";
import "./styles/detail.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
