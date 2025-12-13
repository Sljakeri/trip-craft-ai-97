import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force light mode - ensure white background
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
document.body.style.backgroundColor = '#ffffff';

createRoot(document.getElementById("root")!).render(<App />);
