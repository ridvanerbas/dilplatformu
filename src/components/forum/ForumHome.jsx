import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Search, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ForumHome = () => {
  const [categories, setCategories] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchRecentTopics();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load forum categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`*, forum_categories(name), users(name), forum_posts(id)`);

      if (error) throw error;

      // Process data to count replies
      const processedTopics = data.map((topic) => ({
        ...topic,
        reply_count: topic.forum_posts ? topic.forum_posts.length - 1 : 0, // Subtract 1 to exclude the initial post
      }));

      setRecentTopics(processedTopics || []);
    } catch (error) {
      console.error("Error fetching recent topics:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Language Learning Forum</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Topic
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forum topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Forum Categories</h2>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">
                        <Link
                          to={`/forum/category/${category.slug}`}
                          className="hover:text-primary"
                        >
                          {category.name}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>0 topics</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {recentTopics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No recent topics found.
            </div>
          ) : (
            <div className="space-y-3">
              {recentTopics.slice(0, 5).map((topic) => (
                <div
                  key={topic.id}
                  className="p-3 border rounded-md hover:bg-slate-50 transition-colors"
                >
                  <Link
                    to={`/forum/topic/${topic.id}`}
                    className="font-medium hover:text-primary block truncate"
                  >
                    {topic.title}
                  </Link>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{topic.users?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(topic.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{topic.reply_count} replies</span>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/forum/topics">View All Topics</Link>
              </Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-2">Forum Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Topics:</span>
                <span className="font-medium">{recentTopics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Categories:</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users:</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHome;
