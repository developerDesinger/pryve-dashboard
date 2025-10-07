"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6">
        <div className="text-[18px] font-semibold mb-4">Sign in</div>
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
            <Input id="email" type="email" placeholder="you@company.com" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}


