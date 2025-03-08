import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Demo login function for testing without actual auth
  const handleDemoLogin = async (role) => {
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

      toast({
        title: "Login successful",
        description: `You are now logged in as ${role}.`,
      });

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Get selected role from radio buttons
    const roleInputs = document.querySelectorAll('input[name="role"]');
    let selectedRole = "student";
    for (const input of roleInputs) {
      if (input.checked) {
        selectedRole = input.value;
        break;
      }
    }
    handleDemoLogin(selectedRole);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Dil Öğrenme Platformu
          </CardTitle>
          <CardDescription>
            Devam etmek için hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="e-posta@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rol Seçin</Label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    defaultChecked
                  />
                  <span>Öğrenci</span>
                </label>
                <label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="role" value="teacher" />
                  <span>Öğretmen</span>
                </label>
                <label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="role" value="admin" />
                  <span>Yönetici</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Giriş yaparak, Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul
            etmiş olursunuz
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
