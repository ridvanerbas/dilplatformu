import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import ContentTabs from "../content/ContentTabs";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  lastLogin: string;
  password?: string;
  language?: string;
  active?: boolean;
}

interface UserManagementProps {
  initialUsers?: User[];
}

const UserManagement = ({ initialUsers }: UserManagementProps = {}) => {
  const [users, setUsers] = useState<User[]>(
    initialUsers || [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "student",
        status: "active",
        lastLogin: "2023-06-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "teacher",
        status: "active",
        lastLogin: "2023-06-14T08:45:00Z",
      },
      {
        id: "3",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "admin",
        status: "active",
        lastLogin: "2023-06-16T14:20:00Z",
      },
      {
        id: "4",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        role: "student",
        status: "inactive",
        lastLogin: "2023-05-30T09:15:00Z",
      },
      {
        id: "5",
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        role: "teacher",
        status: "active",
        lastLogin: "2023-06-13T11:50:00Z",
      },
    ],
  );

  const [activeTab, setActiveTab] = useState("userTable");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormVisible(true);
    setActiveTab("userForm");
  };

  const handleEditUser = (userId: string) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setIsFormVisible(true);
      setActiveTab("userForm");
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleFormSubmit = (formData: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...formData,
                status: formData.active ? "active" : "inactive",
              }
            : user,
        ),
      );
    } else {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.active ? "active" : "inactive",
        lastLogin: new Date().toISOString(),
        password: formData.password,
        language: formData.language,
      };
      setUsers([...users, newUser]);
    }
    setIsFormVisible(false);
    setActiveTab("userTable");
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setActiveTab("userTable");
  };

  return (
    <div className="w-full h-full bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={handleAddUser}>Add New User</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="userTable" className="mt-0">
            <UserTable
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </TabsContent>

          <TabsContent value="userForm" className="mt-0">
            {isFormVisible && (
              <UserForm
                user={editingUser || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isEditing={!!editingUser}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;
