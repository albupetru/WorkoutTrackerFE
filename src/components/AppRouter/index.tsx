import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "../Dashboard";
import LoginPage from "../LoginPage";
import Layout from "../Layout";
import ExerciseLibrary from "../ExerciseLibrary";
import ExerciseDetail from "../ExerciseDetail";
import ProtectedLayout from "../ProtectedLayout";

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route element={<Layout />}>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/exercise-library" element={<ExerciseLibrary />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
        </Route>
      </Route>
    </>,
  ),
);

export default AppRouter;
