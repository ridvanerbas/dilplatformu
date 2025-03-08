import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "@/components/home";
import LoginForm from "@/components/auth/LoginForm";
import UnauthorizedPage from "@/components/auth/UnauthorizedPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ForumHome from "@/components/forum/ForumHome";
import MembershipPlans from "@/components/membership/MembershipPlans";
import ProfilePage from "@/components/profile/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes */}
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

      {/* Teacher routes */}
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
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <Home currentView="schedule" />
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
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

      {/* Common routes */}
      <Route
        path="/forum"
        element={
          <ProtectedRoute>
            <Home currentView="forum" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/membership"
        element={
          <ProtectedRoute>
            <Home currentView="membership" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Home currentView="achievements" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
    </Routes>
  );
};

export default AppRoutes;
