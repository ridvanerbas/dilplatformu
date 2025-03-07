import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children?: ReactNode;
  userRole?: "student" | "teacher" | "admin";
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  pageTitle?: string;
  onLogout?: () => void;
}

const DashboardLayout = ({
  children,
  userRole = "admin",
  userName = "Jane Doe",
  userEmail = "jane.doe@example.com",
  userAvatar = "",
  pageTitle = "Dashboard",
  onLogout = () => console.log("Logging out..."),
}: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={pageTitle}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
