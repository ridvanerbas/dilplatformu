import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserManagement from "./users/UserManagement";
import ContentManagement from "./content/ContentManagement";
import SystemSettings from "./settings/SystemSettings.jsx";
import VocabularyManager from "./student/VocabularyManager.jsx";
import SentenceManager from "./student/SentenceManager.jsx";
import ListeningRoom from "./student/ListeningRoom.jsx";
import PracticeHub from "./student/PracticeHub.jsx";
import DialoguePractice from "./student/DialoguePractice.jsx";
import StoryPractice from "./student/StoryPractice.jsx";

type UserRole = "student" | "teacher" | "admin";

interface HomeProps {
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  currentView?: string;
  defaultTab?: string;
}

const Home = ({
  userRole: propUserRole,
  userName: propUserName,
  userEmail: propUserEmail,
  userAvatar: propUserAvatar,
  currentView: propCurrentView,
  defaultTab,
}: HomeProps) => {
  const [currentView, setCurrentView] = useState<string>(
    propCurrentView || "dashboard",
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage for demo purposes
  // In a real app, this would come from the authenticated user's data
  const [userRole, setUserRole] = useState<UserRole>(propUserRole || "admin");
  const [userName, setUserName] = useState<string>(propUserName || "Jane Doe");
  const [userEmail, setUserEmail] = useState<string>(
    propUserEmail || "jane.doe@example.com",
  );
  const [userAvatar, setUserAvatar] = useState<string>(
    propUserAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  );

  useEffect(() => {
    // Update current view from props if provided
    if (propCurrentView) {
      setCurrentView(propCurrentView);
    }

    // Get user info from localStorage for demo purposes
    const storedRole = localStorage.getItem("userRole") as UserRole;
    const storedName = localStorage.getItem("userName");

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedName) {
      setUserName(storedName);
      // Generate avatar based on name
      setUserAvatar(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedName.replace(/\s+/g, "")}`,
      );
    }

    // Set email based on role for demo
    if (storedRole) {
      setUserEmail(`${storedRole.toLowerCase()}@example.com`);
    }
  }, [propCurrentView, propUserRole]);

  // Update current view when location changes
  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    setCurrentView(path);
  }, [location]);

  // Function to render the appropriate content based on user role and current view
  const renderContent = () => {
    // Admin views
    if (userRole === "admin") {
      switch (currentView) {
        case "dashboard":
          return <AdminDashboard userName={userName} />;
        case "users":
          return <UserManagement />;
        case "content":
          return <ContentManagement defaultTab={defaultTab} />;
        case "settings":
          return <SystemSettings />;
        default:
          return <AdminDashboard userName={userName} />;
      }
    }

    // Teacher views
    if (userRole === "teacher") {
      switch (currentView) {
        case "dashboard":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
              <p className="text-gray-600">
                Welcome to the teacher dashboard. Here you can manage your
                courses, create lessons, and track student progress.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Teacher dashboard content would appear here
                </p>
              </div>
            </div>
          );
        case "courses":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">My Courses</h1>
              <p className="text-gray-600">
                Manage your teaching courses, materials, and student
                enrollments.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Teacher courses interface would appear here
                </p>
              </div>
            </div>
          );
        case "lessons":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Lessons</h1>
              <p className="text-gray-600">
                Create and manage lessons for your courses.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Lesson management interface would appear here
                </p>
              </div>
            </div>
          );
        case "questions":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Questions</h1>
              <p className="text-gray-600">
                Create and manage questions for assessments and quizzes.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Question management interface would appear here
                </p>
              </div>
            </div>
          );
        case "students":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Students</h1>
              <p className="text-gray-600">
                View and manage your students and their progress.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Student management interface would appear here
                </p>
              </div>
            </div>
          );
        case "materials":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Materials</h1>
              <p className="text-gray-600">
                Upload and manage learning materials for your courses.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700">
                  Materials management interface would appear here
                </p>
              </div>
            </div>
          );
        default:
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
              <p className="text-gray-600">
                Welcome to the teacher dashboard. Here you can manage your
                courses, create lessons, and track student progress.
              </p>
            </div>
          );
      }
    }

    // Student views
    if (userRole === "student") {
      switch (currentView) {
        case "dashboard":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
              <p className="text-gray-600">
                Welcome to your learning dashboard. Here you can access your
                courses, track your progress, and practice your language skills.
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-700">
                  Student dashboard content would appear here
                </p>
              </div>
            </div>
          );
        case "courses":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">My Courses</h1>
              <p className="text-gray-600">
                Access your enrolled courses and continue your learning journey.
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-700">
                  Student courses interface would appear here
                </p>
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
        default:
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
              <p className="text-gray-600">
                Welcome to your learning dashboard. Here you can access your
                courses, track your progress, and practice your language skills.
              </p>
            </div>
          );
      }
    }

    // Default fallback
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600">Please log in to access your dashboard.</p>
      </div>
    );
  };

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      userAvatar={userAvatar}
      pageTitle={
        currentView.split("/").pop()?.charAt(0).toUpperCase() +
          currentView.split("/").pop()?.slice(1) || "Dashboard"
      }
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Home;
