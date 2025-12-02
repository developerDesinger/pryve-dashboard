"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordSentPage() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="card w-full max-w-sm p-6 text-center">
        <div className="text-[18px] font-semibold mb-2">Check your email</div>
        <p className="text-[14px] text-muted-foreground mb-6">
          {email ? (
            <>
              We sent a reset code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Please check your inbox (and spam) for further instructions.
            </>
          ) : (
            <>We sent a reset code to your email. Please check your inbox.</>
          )}
        </p>

        <div className="space-y-3">
          <Link
            href={`/reset-password${
              email ? `?email=${encodeURIComponent(email)}` : ""
            }`}
          >
            <Button className="w-full">Enter reset code</Button>
          </Link>
          <Link
            href="/login"
            className="text-primary hover:underline inline-block"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
