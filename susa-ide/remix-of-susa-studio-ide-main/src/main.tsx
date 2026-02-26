import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add error boundary for debugging
const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: Arial;">Error: Root element not found</div>';
} else {
  try {
    console.log('Starting SUSA IDE...');
    createRoot(rootElement).render(<App />);
    console.log('SUSA IDE React app rendered successfully');
  } catch (error) {
    console.error('React render error:', error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: Arial;">
      <h1>SUSA IDE Loading Error</h1>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Please check the console for more details.</p>
    </div>`;
  }
}
