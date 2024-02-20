import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import Layout from "./components/Layout";
import ExerciseLibrary from "./components/ExerciseLibrary";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/exercise-library",
        element: <ExerciseLibrary />,
        // children: [
        //   {
        //     path: "/:exerciseId",
        //     element: <ExerciseLibrary />,
        //   },
        // ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1067310328771-don2j7q8le595rbv260bjg3mg5dga2h9.apps.googleusercontent.com">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
