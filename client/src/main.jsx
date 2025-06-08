import React from "react";
import ReactDOM from "react-dom/client";
import "bulma/css/bulma.min.css";
import "../../design/css/reset.css";
import "../../design/css/main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
