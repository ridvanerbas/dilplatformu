import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, BookOpen, Headphones, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PracticeHub = () => {
  const navigate = useNavigate();

  const practiceOptions = [
    {
      title: "Dialogues",
      description: "Practice conversations in different scenarios",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50",
      path: "/practice/dialogues",
    },
    {
      title: "Stories",
      description: "Read and listen to stories to improve comprehension",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50",
      path: "/practice/stories",
    },
    {
      title: "Listening Room",
      description: "Improve your listening skills with audio content",
      icon: <Headphones className="h-8 w-8 text-green-500" />,
      color: "bg-green-50",
      path: "/listening-room",
    },
  ];

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Practice Hub</h1>
        <p className="text-muted-foreground">
          Choose a practice activity to improve your language skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {practiceOptions.map((option, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`${option.color} p-6 flex items-center justify-center`}
              >
                {option.icon}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{option.title}</h2>
                <p className="text-muted-foreground mb-4">
                  {option.description}
                </p>
                <Button
                  onClick={() => navigate(option.path)}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Your Practice Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Total Practice Time</p>
            <p className="text-2xl font-bold">12h 30m</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Completed Sessions</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHub;
