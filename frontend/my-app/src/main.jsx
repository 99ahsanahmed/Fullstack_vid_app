import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/Authcontext.jsx'
import { VideoProvider } from "./context/VideoContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <VideoProvider>
      <App />
      </VideoProvider>
    </AuthProvider>
  </StrictMode>
);
