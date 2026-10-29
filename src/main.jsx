import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PrismStudio from "./components/studio/PrismStudio.jsx";
import Signin from "./auth/Signin.jsx";
import Home from "./Home/Home.jsx";
import Dashboard from "./Home/Dashboard.jsx";
import EditResume from "./resume/EditResume.jsx";
import FinalPage from "./resume/FinalPage.jsx";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

const router = createBrowserRouter([
  // Main AI LaTeX & DOCX Studio (OpenAI Prism + Overleaf)
  {
    path: "/",
    element: <PrismStudio />
  },
  {
    path: "/studio",
    element: <PrismStudio />
  },
  // Legacy Resume Builder Routes
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/resume/:resumeId/edit",
        element: <EditResume />,
      },
      {
        path: "/myResume/:resumeId",
        element: <FinalPage />,
      },
    ],
  },
  {
    path: "/legacy-home",
    element: <Home />
  },
  {
    path: "/auth/signin",
    element: <Signin />,
  },
]);

function Root() {
  // If Clerk key is available, wrap with ClerkProvider, else render router directly
  if (PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes('placeholder')) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <RouterProvider router={router} />
      </ClerkProvider>
    );
  }

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
