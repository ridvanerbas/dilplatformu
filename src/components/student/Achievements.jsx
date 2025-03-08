import React, { useState, useEffect } from "react";
import { Trophy, Award, Star, Medal, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("achievements");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // In a real app, this would use the current user's ID
      const userId = "current-user-id";

      // Fetch user achievements
      const { data: achievementsData, error: achievementsError } =
        await supabase.from("user_achievements").select(`*, achievements(*)`);

      if (achievementsError) throw achievementsError;

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from("user_badges")
        .select(`*, badges(*)`);

      if (badgesError) throw badgesError;

      // Fetch user points and level
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("points, level")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      setAchievements(achievementsData || []);
      setBadges(badgesData || []);
      setPoints(userData?.points || 0);
      setLevel(userData?.level || 1);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockAchievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      progress: 100,
      max_progress: 100,
      completed: true,
      completed_at: "2023-06-15T10:30:00Z",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      points_reward: 50,
    },
    {
      id: 2,
      title: "Vocabulary Master",
      description: "Learn 100 words",
      progress: 78,
      max_progress: 100,
      completed: false,
      icon: <Star className="h-6 w-6 text-blue-500" />,
      points_reward: 100,
    },
    {
      id: 3,
      title: "Conversation Starter",
      description: "Complete 5 dialogue practices",
      progress: 3,
      max_progress: 5,
      completed: false,
      icon: <Medal className="h-6 w-6 text-green-500" />,
      points_reward: 75,
    },
    {
      id: 4,
      title: "Story Explorer",
      description: "Read 10 stories",
      progress: 4,
      max_progress: 10,
      completed: false,
      icon: <Award className="h-6 w-6 text-purple-500" />,
      points_reward: 120,
    },
  ];

  const mockBadges = [
    {
      id: 1,
      name: "Early Bird",
      description: "Awarded for joining the platform in its first month",
      image_url: "🌅",
      earned_at: "2023-05-10T08:15:00Z",
    },
    {
      id: 2,
      name: "Perfect Week",
      description: "Practice every day for a week",
      image_url: "🔥",
      earned_at: "2023-06-20T14:25:00Z",
    },
    {
      id: 3,
      name: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      image_url: "🧠",
      earned_at: "2023-07-05T11:10:00Z",
    },
  ];

  // Calculate XP needed for next level
  const calculateNextLevelXP = (currentLevel) => {
    return currentLevel * 100;
  };

  const nextLevelXP = calculateNextLevelXP(level);
  const progressToNextLevel = ((points % nextLevelXP) / nextLevelXP) * 100;

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your achievements, badges, and learning progress
        </p>
      </div>

      {/* Level and Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{level}</div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{points}</div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{points % nextLevelXP} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
              <Progress value={progressToNextLevel} />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(nextLevelXP - (points % nextLevelXP))} XP needed for
                level {level + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Achievements and Badges */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading achievements...
            </div>
          ) : (
            mockAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.completed ? (
                          <Badge variant="default" className="bg-green-500">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            +{achievement.points_reward} XP
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {achievement.progress} / {achievement.max_progress}
                          </span>
                          <span>
                            {Math.round(
                              (achievement.progress /
                                achievement.max_progress) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (achievement.progress / achievement.max_progress) *
                            100
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading badges...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockBadges.map((badge) => (
                <Card key={badge.id}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="text-4xl mb-2">{badge.image_url}</div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {badge.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Earned on {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;
