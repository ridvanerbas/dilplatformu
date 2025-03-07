import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ActivityType =
  | "user_registration"
  | "course_enrollment"
  | "content_update"
  | "lesson_completion";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
    role: "student" | "teacher" | "admin";
  };
}

interface RecentActivityListProps {
  activities?: Activity[];
  maxItems?: number;
  title?: string;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "user_registration":
      return "bg-green-100 text-green-800";
    case "course_enrollment":
      return "bg-blue-100 text-blue-800";
    case "content_update":
      return "bg-purple-100 text-purple-800";
    case "lesson_completion":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getActivityBadge = (type: ActivityType) => {
  switch (type) {
    case "user_registration":
      return { label: "New User", variant: "default" as const };
    case "course_enrollment":
      return { label: "Enrollment", variant: "secondary" as const };
    case "content_update":
      return { label: "Update", variant: "outline" as const };
    case "lesson_completion":
      return { label: "Completion", variant: "secondary" as const };
    default:
      return { label: "Activity", variant: "outline" as const };
  }
};

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "user_registration",
    title: "New Student Registration",
    description: "Sarah Johnson registered as a new student",
    timestamp: "2023-06-15T10:30:00Z",
    user: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      role: "student",
    },
  },
  {
    id: "2",
    type: "course_enrollment",
    title: "Course Enrollment",
    description: 'Michael Chen enrolled in "Spanish for Beginners"',
    timestamp: "2023-06-14T15:45:00Z",
    user: {
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      role: "student",
    },
  },
  {
    id: "3",
    type: "content_update",
    title: "Course Content Updated",
    description: 'Prof. Rodriguez updated "Advanced French Grammar"',
    timestamp: "2023-06-14T09:15:00Z",
    user: {
      name: "Prof. Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rodriguez",
      role: "teacher",
    },
  },
  {
    id: "4",
    type: "lesson_completion",
    title: "Lesson Completed",
    description: 'Emily Wilson completed "German Vocabulary Basics"',
    timestamp: "2023-06-13T16:20:00Z",
    user: {
      name: "Emily Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      role: "student",
    },
  },
  {
    id: "5",
    type: "user_registration",
    title: "New Teacher Registration",
    description: "Dr. Patel joined as a new language instructor",
    timestamp: "2023-06-12T11:05:00Z",
    user: {
      name: "Dr. Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patel",
      role: "teacher",
    },
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const RecentActivityList = ({
  activities = defaultActivities,
  maxItems = 5,
  title = "Recent Activity",
}: RecentActivityListProps) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Avatar>
                  <AvatarImage
                    src={activity.user.avatar}
                    alt={activity.user.name}
                  />
                  <AvatarFallback>
                    {activity.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Badge variant={getActivityBadge(activity.type).variant}>
                      {getActivityBadge(activity.type).label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
