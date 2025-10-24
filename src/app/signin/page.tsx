"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLoader } from "@/components/ui/loader";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Login function now handles all loading states and error messages via toast
    await login(formData.email, formData.password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary-foreground"
            >
              <path 
                d="M16 2L20.09 8.26L28 9L22 14.74L23.18 22.64L16 19.27L8.82 22.64L10 14.74L4 9L11.91 8.26L16 2Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Pryve</h1>
          <p className="text-muted-foreground text-lg">
            Sign in to your dashboard
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-semibold text-center text-foreground">
              Sign In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Pryve. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
