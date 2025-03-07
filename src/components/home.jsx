import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserManagement from "./users/UserManagement";
import ContentManagement from "./content/ContentManagement";
import SystemSettings from "./settings/SystemSettings";
import VocabularyManager from "./student/VocabularyManager";
import SentenceManager from "./student/SentenceManager";
import ListeningRoom from "./student/ListeningRoom";
import PracticeHub from "./student/PracticeHub";
import DialoguePractice from "./student/DialoguePractice";
import StoryPractice from "./student/StoryPractice";
import Achievements from "./student/Achievements";
import MembershipPlans from "./membership/MembershipPlans";
import ForumHome from "./forum/ForumHome";
import ScheduleManager from "./teacher/ScheduleManager";
import MaterialsManager from "./content/MaterialsManager";
import { useAuth } from "@/lib/auth";

const Home = ({ currentView = "dashboard", defaultTab }) => {
  const [view, setView] = useState(currentView);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Update current view when props change
  useEffect(() => {
    setView(currentView);
  }, [currentView]);

  // Update current view when location changes
  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    setView(path);
  }, [location]);

  // Function to render the appropriate content based on user role and current view
  const renderContent = () => {
    // Get user role from auth context
    const userRole = user?.role || "student";

    // Admin views
    if (userRole === "admin") {
      switch (view) {
        case "dashboard":
          return <AdminDashboard userName={user?.name} />;
        case "users":
          return <UserManagement />;
        case "content":
          return <ContentManagement defaultTab={defaultTab} />;
        case "settings":
          return <SystemSettings />;
        case "membership":
          return <MembershipPlans />;
        case "forum":
          return <ForumHome />;
        default:
          return <AdminDashboard userName={user?.name} />;
      }
    }

    // Teacher views
    if (userRole === "teacher") {
      switch (view) {
        case "dashboard":
          return <AdminDashboard userName={user?.name} isTeacher={true} />;
        case "courses":
          return <div>Teacher Courses</div>;
        case "lessons":
          return <div>Lessons Management</div>;
        case "questions":
          return <div>Questions Management</div>;
        case "students":
          return <div>Student Management</div>;
        case "materials":
          return <MaterialsManager />;
        case "schedule":
          return <ScheduleManager />;
        case "forum":
          return <ForumHome />;
        case "membership":
          return <MembershipPlans />;
        default:
          return <AdminDashboard userName={user?.name} isTeacher={true} />;
      }
    }

    // Student views
    if (userRole === "student") {
      switch (view) {
        case "dashboard":
          return <AdminDashboard userName={user?.name} isStudent={true} />;
        case "courses":
          return <div>My Courses</div>;
        case "vocabulary":
          return <VocabularyManager />;
        case "sentences":
          return <SentenceManager />;
        case "listening-room":
          return <ListeningRoom />;
        case "practice":
          return <PracticeHub />;
        case "practice/dialogues":
          return <DialoguePractice />;
        case "practice/stories":
          return <StoryPractice />;
        case "forum":
          return <ForumHome />;
        case "membership":
          return <MembershipPlans />;
        case "achievements":
          return <Achievements />;
        default:
          return <AdminDashboard userName={user?.name} isStudent={true} />;
      }
    }

    // Default fallback
    return <div>Welcome to the Language Learning Platform</div>;
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <DashboardLayout
      userRole={user?.role}
      userName={user?.name}
      userEmail={user?.email}
      userAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
      pageTitle={
        view.split("/").pop()?.charAt(0).toUpperCase() +
          view.split("/").pop()?.slice(1) || "Dashboard"
      }
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Home;
