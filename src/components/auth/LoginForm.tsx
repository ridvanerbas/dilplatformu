import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo login function for testing without actual auth
  const handleDemoLogin = async (role: "student" | "teacher" | "admin") => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would authenticate with Supabase here
      // For demo purposes, we'll just navigate to the dashboard
      localStorage.setItem("userRole", role);
      localStorage.setItem(
        "userName",
        role === "admin"
          ? "Admin User"
          : role === "teacher"
            ? "Teacher User"
            : "Student User",
      );
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Language Learning Platform
          </CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            redirectTo={window.location.origin}
          />

          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or use demo accounts
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin("student")}
                disabled={loading}
              >
                Login as Student
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin("teacher")}
                disabled={loading}
              >
                Login as Teacher
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
              >
                Login as Administrator
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
