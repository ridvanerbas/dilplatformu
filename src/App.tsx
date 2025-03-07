import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider.jsx";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm.jsx";
import UnauthorizedPage from "./components/auth/UnauthorizedPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="users" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="content" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/languages"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="content" defaultTab="languages" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="content" defaultTab="courses" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/dictionary"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="content" defaultTab="dictionary" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/materials"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="content" defaultTab="materials" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home currentView="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={["teacher", "student"]}>
                <Home currentView="courses" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Home currentView="lessons" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Home currentView="questions" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Home currentView="students" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Home currentView="materials" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vocabulary"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="vocabulary" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sentences"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="sentences" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listening-room"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="listening-room" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="practice" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/dialogues"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="practice/dialogues" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/stories"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Home currentView="practice/stories" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Home currentView="profile" />
              </ProtectedRoute>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </AuthProvider>
    </Suspense>
  );
}

export default App;
