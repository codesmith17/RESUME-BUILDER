import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
//
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/custom/Header";
function App() {
  const [count, setCount] = useState(0);
  const { user, isSignedIn, isLoaded } = useUser();
  if (!isSignedIn && isLoaded) {
    return <Navigate to={`/auth/signin`} />;
  }
  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
