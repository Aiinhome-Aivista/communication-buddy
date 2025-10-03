import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./provider/AuthProvider.jsx";
import { TopicProvider } from "./provider/TopicProvider.jsx";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './utils/ColorTemplate.css';
import { UserProvider } from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
  <AuthProvider>
    <TopicProvider>
      <App />
    </TopicProvider>
  </AuthProvider>
  </UserProvider>
);
