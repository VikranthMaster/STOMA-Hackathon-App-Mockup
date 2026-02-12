import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { Routes, Route } from "react-router";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
