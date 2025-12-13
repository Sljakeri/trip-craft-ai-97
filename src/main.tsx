import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force light mode - remove dark class if present
document.documentElement.classList.remove('dark');

createRoot(document.getElementById("root")!).render(<App />);
