"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await forgotPassword(email);
    setLoading(false);
    if (ok) {
      router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6">
          <div className="text-[18px] font-semibold mb-1">Forgot password</div>
          <p className="text-[14px] text-muted-foreground">
            Enter your email and we'll send you a reset code.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? "Sending..." : "Send reset code"}
          </Button>
        </form>
      </div>
    </div>
  );
}
