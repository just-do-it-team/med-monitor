import { createRoot } from "react-dom/client";
import App from "./app/app.tsx";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/app/providers/error-boundary";
import "./app/styles/index.scss";
import { QueryProvider } from "@/app/providers/query-provider/query-provider.tsx";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <BrowserRouter>
      <QueryProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </QueryProvider>
    </BrowserRouter>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
