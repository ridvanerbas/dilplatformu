import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { Users, BookOpen, GraduationCap, Languages } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("bg-white", className)}>
      <CardContent className="flex items-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline">
            <h4 className="text-2xl font-bold">{value}</h4>
            {trend && (
              <span
                className={cn(
                  "ml-2 text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface StatisticsCardsProps {
  stats?: {
    totalUsers: number;
    totalCourses: number;
    activeStudents: number;
    languages: number;
  };
  className?: string;
}

const StatisticsCards = ({
  stats = {
    totalUsers: 1250,
    totalCourses: 48,
    activeStudents: 876,
    languages: 12,
  },
  className,
}: StatisticsCardsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={<Users className="h-6 w-6 text-primary" />}
        trend={{ value: 12, isPositive: true }}
        description="Total registered users"
      />
      <StatCard
        title="Total Courses"
        value={stats.totalCourses}
        icon={<BookOpen className="h-6 w-6 text-primary" />}
        trend={{ value: 8, isPositive: true }}
        description="Available learning courses"
      />
      <StatCard
        title="Active Students"
        value={stats.activeStudents.toLocaleString()}
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
        trend={{ value: 5, isPositive: true }}
        description="Students active this month"
      />
      <StatCard
        title="Languages"
        value={stats.languages}
        icon={<Languages className="h-6 w-6 text-primary" />}
        description="Supported languages"
      />
    </div>
  );
};

export default StatisticsCards;
