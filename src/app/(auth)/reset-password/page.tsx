"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { authAPI } from "@/lib/api/auth";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { showError, showSuccess, showLoading, dismiss } = useToast();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pEmail = params.get("email") || "";
    const pUserId = params.get("userId") || "";
    const pOtp = params.get("otp") || "";
    if (pEmail) setEmail(pEmail);
    if (pUserId) setUserId(pUserId);
    if (pOtp) setOtp(pOtp);
  }, [params]);

  const isDisabled = useMemo(() => {
    return (
      !email ||
      !otp ||
      !password ||
      password.length < 8 ||
      password !== confirmPassword ||
      !userId
    );
  }, [email, otp, password, confirmPassword, userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    const loadingToast = showLoading("Updating password...");
    setLoading(true);
    const otpNumber = Number(otp);

    try {
      const res = await authAPI.updatePassword(
        email,
        userId,
        otpNumber,
        password
      );
      dismiss(loadingToast);
      setLoading(false);
      if (res.success) {
        showSuccess("Password updated successfully. You can now sign in.");
        router.push("/login");
      } else {
        showError(
          res.message || "Failed to update password. Please try again."
        );
      }
    } catch (err) {
      dismiss(loadingToast);
      setLoading(false);
      showError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6">
          <div className="text-[18px] font-semibold mb-1">Reset password</div>
          <p className="text-[14px] text-muted-foreground">
            Enter the code you received and choose a new password.
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

          <div className="space-y-1">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="text"
              placeholder="Automatically filled from your email link"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <p className="text-[12px] text-muted-foreground">
              This is included in the reset link we emailed you.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="otp">Reset code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full mt-2"
          >
            {loading ? "Updating..." : "Reset password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
