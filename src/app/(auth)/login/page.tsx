"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6">
          <div className="text-[18px] font-semibold mb-1">Sign in</div>
          <p className="text-[14px] text-muted-foreground">
            Welcome back to Pryve Dashboard
          </p>
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => setLoading(false), 1200);
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-[14px] text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-6 text-center text-[14px]">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
