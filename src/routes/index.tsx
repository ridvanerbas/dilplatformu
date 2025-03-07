import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/components/home";
import LoginForm from "@/components/auth/LoginForm";
import UnauthorizedPage from "@/components/auth/UnauthorizedPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Create routes
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="users" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/content",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="content" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/content/languages",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="content" defaultTab="languages" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/content/courses",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="content" defaultTab="courses" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/content/dictionary",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="content" defaultTab="dictionary" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/content/materials",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="content" defaultTab="materials" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Home currentView="settings" />
      </ProtectedRoute>
    ),
  },
  // Teacher routes
  {
    path: "/courses",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "student"]}>
        <Home currentView="courses" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/lessons",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <Home currentView="lessons" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <Home currentView="questions" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/students",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <Home currentView="students" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/materials",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <Home currentView="materials" />
      </ProtectedRoute>
    ),
  },
  // Student routes
  {
    path: "/vocabulary",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="vocabulary" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sentences",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="sentences" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/listening-room",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="listening-room" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/practice",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="practice" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/practice/dialogues",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="practice/dialogues" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/practice/stories",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <Home currentView="practice/stories" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Home currentView="profile" />
      </ProtectedRoute>
    ),
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
