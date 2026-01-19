"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import { authAPI } from "@/lib/api/auth";
import { cookieUtils } from "@/lib/cookies";
import { useAuth } from "@/contexts/AuthContext";

function ForgotPasswordSentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");
  const { showError, showSuccess, showLoading, dismiss } = useToast();
  const { setAuthenticatedUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Email is missing. Please try again.");
      return;
    }

    if (!otp || otp.length !== 6) {
      showError("Please enter a valid 6-digit code");
      return;
    }

    const loadingToast = showLoading("Verifying code...");
    setLoading(true);

    try {
      const res: any = await authAPI.verifyOTP(email, otp);
      dismiss(loadingToast);
      setLoading(false);
      console.log("res", res.data);

      if (res.data.success === true) {
        const apiUser = res.data.user;
        const token = res.data.token;

        const userData = {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.fullName,
          fullName: apiUser.fullName,
          userName: apiUser.userName,
          profilePhoto: apiUser.profilePhoto,
          isVerified: apiUser.status === "ACTIVE",
        };

        // Use AuthContext method to set authenticated user and update state
        setAuthenticatedUser(token, userData);

        showSuccess(`Welcome back, ${apiUser.fullName}!`);

        // Navigate to dashboard after successful authentication
        router.push("/dashboard");
      } else {
        showError(res.message || "Invalid or expired code. Please try again.");
      }
    } catch (err) {
      dismiss(loadingToast);
      setLoading(false);
      showError("Network error. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      showError("Email is missing. Please try again.");
      return;
    }

    const loadingToast = showLoading("Resending code...");
    try {
      const res = await authAPI.resendOTP(email);
      dismiss(loadingToast);

      if (res.success) {
        showSuccess("A new code has been sent to your email");
        setOtp("");
      } else {
        showError(res.message || "Failed to resend code. Please try again.");
      }
    } catch (err) {
      dismiss(loadingToast);
      showError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="text-[18px] font-semibold mb-2">Check your email</div>
          <p className="text-[14px] text-muted-foreground">
            {email ? (
              <>
                We sent a reset code to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Please check your inbox (and spam) for the code.
              </>
            ) : (
              <>We sent a reset code to your email. Please check your inbox.</>
            )}
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="otp">Reset code</Label>
            <Input
              id="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify code"}
          </Button>

          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-[14px] text-primary hover:underline"
            >
              Resend code
            </button>
            <div>
              <Link
                href="/login"
                className="text-[14px] text-primary hover:underline inline-block"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordSentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh grid place-items-center p-6">
        <div className="card w-full max-w-sm p-6">
          <div className="text-center">
            <div className="text-[18px] font-semibold mb-2">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <ForgotPasswordSentContent />
    </Suspense>
  );
}
