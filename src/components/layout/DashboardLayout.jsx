import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({
  children,
  userRole = "admin",
  userName = "Jane Doe",
  userEmail = "jane.doe@example.com",
  userAvatar = "",
  pageTitle = "Dashboard",
  onLogout = () => console.log("Logout clicked"),
}) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onLogout={onLogout}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          pageTitle={pageTitle}
          userName={userName}
          userAvatar={userAvatar}
        />
        <main className="flex-1 overflow-auto p-4 bg-slate-50">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
