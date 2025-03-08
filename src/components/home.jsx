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
import { useAuth } from "@/components/auth/AuthProvider.jsx";

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

    // Log the current view and role for debugging
    console.log(`Rendering view: ${view} for role: ${userRole}`);

    // Admin views
    if (userRole === "admin") {
      switch (view) {
        case "dashboard":
          return <AdminDashboard userName={user?.name} isAdmin={true} />;
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
          return <AdminDashboard userName={user?.name} isAdmin={true} />;
      }
    }

    // Teacher views
    if (userRole === "teacher") {
      switch (view) {
        case "dashboard":
          return <AdminDashboard userName={user?.name} isTeacher={true} />;
        case "courses":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Teacher Courses</h1>
              <p className="text-muted-foreground mb-6">
                Manage your courses, materials, and student enrollments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Spanish for Beginners</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    15 students enrolled
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Manage
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Business English</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    8 students enrolled
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case "lessons":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Lessons Management</h1>
              <p className="text-muted-foreground mb-6">
                Create and manage lessons for your courses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Spanish Greetings</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Spanish for Beginners • Lesson 1
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Business Vocabulary</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Business English • Lesson 2
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case "questions":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Questions Management</h1>
              <p className="text-muted-foreground mb-6">
                Create and manage questions for assessments and quizzes.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">
                    Spanish Vocabulary Quiz
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    10 questions • Multiple choice
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">
                    Business English Assessment
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    15 questions • Mixed format
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case "students":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Student Management</h1>
              <p className="text-muted-foreground mb-6">
                View and manage your students and their progress.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">John Smith</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Spanish for Beginners • 75% complete
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      View Progress
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Maria Garcia</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Business English • 45% complete
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      View Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
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
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">My Courses</h1>
              <p className="text-muted-foreground mb-6">
                Access your enrolled courses and continue your learning journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Spanish for Beginners</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Progress: 65%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Continue Learning
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">French Basics</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Progress: 30%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
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
