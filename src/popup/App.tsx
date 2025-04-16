import "./App.css";
import LoaderProvider from "@/providers/loader.provider";
import { Toaster } from "sonner";
import HomePage from "./home/HomePage";

function App() {
  return (
    <>
      <LoaderProvider>
        <Toaster />
        <HomePage />
      </LoaderProvider>
    </>
  );
}

export default App;
