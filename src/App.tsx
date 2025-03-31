import "./App.css";
import HomePage from "@/modules/HomePage";
import LoaderProvider from "@/providers/loader.provider";
import { Toaster } from "sonner";

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
