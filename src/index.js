import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./Router";
import { RouterProvider } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </StrictMode>
);
