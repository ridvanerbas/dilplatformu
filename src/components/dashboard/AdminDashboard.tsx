import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  isAdmin?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
}

const AdminDashboard = ({
  stats = {
    totalUsers: 1250,
    totalCourses: 48,
    activeStudents: 876,
    languages: 12,
  },
  userName = "Admin",
  isAdmin = false,
  isTeacher = false,
  isStudent = false,
}: AdminDashboardProps) => {
  // Determine dashboard content based on role
  const renderDashboardContent = () => {
    if (isAdmin) {
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
                <CardTitle className="text-xl font-bold">
                  Recent Activity
                </CardTitle>
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
                <CardTitle className="text-xl font-bold">
                  Quick Actions
                </CardTitle>
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
    } else if (isTeacher) {
      return (
        <div className="w-full h-full p-6 space-y-6 bg-slate-50">
          {/* Welcome section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your teaching activities.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Schedule Class</Button>
              <Button>Create Lesson</Button>
            </div>
          </div>

          {/* Teacher Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  2 active, 3 draft
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Next: Today at 3PM
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Materials Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+3 this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Schedule */}
            <Card className="col-span-1 lg:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-primary rounded-sm bg-slate-50">
                    <p className="text-sm font-medium">3:00 PM - 4:00 PM</p>
                    <p className="text-sm">Spanish Conversation Practice</p>
                    <p className="text-xs text-muted-foreground">5 students</p>
                  </div>
                  <div className="p-3 border-l-4 border-primary rounded-sm bg-slate-50">
                    <p className="text-sm font-medium">5:30 PM - 6:30 PM</p>
                    <p className="text-sm">Business English - Private Lesson</p>
                    <p className="text-xs text-muted-foreground">
                      with John Smith
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-between" variant="outline">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Create New Lesson</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>View Student Progress</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Create Assessment</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Student Progress */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Student Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">
                        Spanish for Beginners
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">75%</p>
                      <p className="text-sm text-muted-foreground">
                        Last active: Today
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <p className="font-medium">Maria Garcia</p>
                      <p className="text-sm text-muted-foreground">
                        Business English
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">45%</p>
                      <p className="text-sm text-muted-foreground">
                        Last active: Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Materials */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Recent Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="font-medium">Spanish Vocabulary List</p>
                    <p className="text-xs text-muted-foreground">
                      Added 2 days ago
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="font-medium">Business English Slides</p>
                    <p className="text-xs text-muted-foreground">
                      Added 5 days ago
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else if (isStudent) {
      return (
        <div className="w-full h-full p-6 space-y-6 bg-slate-50">
          {/* Welcome section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-muted-foreground">
                Continue your language learning journey.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">My Progress</Button>
              <Button>Practice Now</Button>
            </div>
          </div>

          {/* Student Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  2 in progress, 1 completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vocabulary Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+15 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground">Level 3</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Continue Learning */}
            <Card className="col-span-1 lg:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-md">
                    <h3 className="font-medium">Spanish for Beginners</h3>
                    <p className="text-sm text-muted-foreground">
                      Lesson 3: Common Phrases
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <h3 className="font-medium">French Basics</h3>
                    <p className="text-sm text-muted-foreground">
                      Lesson 2: Greetings
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                </div>
                <div className="flex justify-between">
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      M
                    </div>
                    <span className="text-xs">✓</span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      T
                    </div>
                    <span className="text-xs">✓</span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      W
                    </div>
                    <span className="text-xs">✓</span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      T
                    </div>
                    <span className="text-xs">✓</span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      F
                    </div>
                    <span className="text-xs">✓</span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                      S
                    </div>
                    <span className="text-xs"></span>
                  </div>
                  <div className="w-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                      S
                    </div>
                    <span className="text-xs"></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Activities */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Practice Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Vocabulary Practice</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review and learn new words
                    </p>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Listening Exercise</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Improve your comprehension
                    </p>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="font-medium">5-Day Streak</p>
                    <p className="text-xs text-muted-foreground">
                      Practice 5 days in a row
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="font-medium">Vocabulary Master</p>
                    <p className="text-xs text-muted-foreground">
                      Learn 100 words
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    } else {
      // Default dashboard
      return (
        <div className="w-full h-full p-6 space-y-6 bg-slate-50">
          {/* Welcome section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome, {userName}
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
                <CardTitle className="text-xl font-bold">
                  Recent Activity
                </CardTitle>
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
                <CardTitle className="text-xl font-bold">
                  Quick Actions
                </CardTitle>
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
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  };

  return renderDashboardContent();
};

export default AdminDashboard;
