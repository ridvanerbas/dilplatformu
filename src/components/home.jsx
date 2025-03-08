import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import CourseList from "./courses/CourseList";
import CourseDetail from "./courses/CourseDetail";
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

  // Get courseId from URL params if available
  const { courseId } = useParams();

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
          return <CourseList />;
        case "courseDetail":
          return <CourseDetail />;
        case "lessons":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Ders Yönetimi</h1>
              <p className="text-muted-foreground mb-6">
                Kurslarınız için dersler oluşturun ve yönetin.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">
                    İspanyolca Selamlaşmalar
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Başlangıç İspanyolcası • Ders 1
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Düzenle
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">İş Kelime Hazinesi</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    İş İngilizcesi • Ders 2
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case "questions":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Soru Yönetimi</h1>
              <p className="text-muted-foreground mb-6">
                Değerlendirmeler ve sınavlar için sorular oluşturun ve yönetin.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">
                    İspanyolca Kelime Sınavı
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    10 soru • Çoktan seçmeli
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Düzenle
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">
                    İş İngilizcesi Değerlendirmesi
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    15 soru • Karma format
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        case "students":
          return (
            <div className="p-6 bg-white rounded-lg shadow">
              <h1 className="text-2xl font-bold mb-4">Öğrenci Yönetimi</h1>
              <p className="text-muted-foreground mb-6">
                Öğrencilerinizi ve ilerlemelerini görüntüleyin ve yönetin.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Ahmet Yılmaz</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Başlangıç İspanyolcası • %75 tamamlandı
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      İlerlemeyi Görüntüle
                    </button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <h2 className="font-semibold mb-2">Ayşe Kaya</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    İş İngilizcesi • %45 tamamlandı
                  </p>
                  <div className="flex justify-end">
                    <button className="text-sm text-primary hover:underline">
                      İlerlemeyi Görüntüle
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
          return <CourseList />;
        case "courseDetail":
          return <CourseDetail />;
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
    return <div>Dil Öğrenme Platformuna Hoş Geldiniz</div>;
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
