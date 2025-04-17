import HomePage from "./home/HomePage";
import MainLayout from "./layout/MainLayout";
import "./App.css";
import { createHashRouter, Navigate, RouterProvider } from "react-router";
import LoaderProvider from "@/providers/loader.provider";
import { Toaster } from "sonner";

const router = createHashRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [{ path: "/", Component: HomePage }],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <LoaderProvider>
      <Toaster />
      <RouterProvider router={router} />;
    </LoaderProvider>
  );
}

export default App;
