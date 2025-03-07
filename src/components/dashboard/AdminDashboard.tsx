import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  BarChart,
  Users,
  BookOpen,
  GraduationCap,
  Languages,
  ArrowRight,
} from "lucide-react";
import StatisticsCards from "./StatisticsCards";
import RecentActivityList from "./RecentActivityList";

interface AdminDashboardProps {
  stats?: {
    totalUsers: number;
    totalCourses: number;
    activeStudents: number;
    languages: number;
  };
  userName?: string;
}

const AdminDashboard = ({
  stats = {
    totalUsers: 1250,
    totalCourses: 48,
    activeStudents: 876,
    languages: 12,
  },
  userName = "Admin",
}: AdminDashboardProps) => {
  return (
    <div className="w-full h-full p-6 space-y-6 bg-slate-50">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your language learning platform.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Download Report</Button>
          <Button>View Analytics</Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} />

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-2 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <RecentActivityList />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Add New Course</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <Languages className="mr-2 h-4 w-4" />
                <span>Manage Languages</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>View Student Progress</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Platform Analytics */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">
              Platform Analytics
            </CardTitle>
            <Tabs defaultValue="weekly">
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center border rounded-md">
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart className="h-10 w-10 mb-2" />
                <p>Analytics chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center border rounded-md">
              <div className="flex flex-col items-center text-muted-foreground">
                <PieChart className="h-10 w-10 mb-2" />
                <p>Distribution chart would appear here</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Students</span>
                </div>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">Teachers</span>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Administrators</span>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
