import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Signin from "./auth/Signin.jsx";
import Home from "./Home/Home.jsx";
import Dashboard from "./Home/Dashboard.jsx";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import EditResume from "./resume/EditResume.jsx";
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/resume/:resumeId",
        element: <EditResume />,
      },
    ],
  },
  { path: "/", element: <Home /> },
  {
    path: "/auth/signin",
    element: <Signin />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router}>
        <App />
      </RouterProvider>{" "}
    </ClerkProvider>
  </React.StrictMode>
);
