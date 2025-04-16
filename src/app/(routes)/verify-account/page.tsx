"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationState("error");
        setErrorMessage("No verification token found");
        return;
      }

      try {
        await api.patch("/api/v1/users/verify-email", null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setVerificationState("success");
        setTimeout(() => {
          router.push("/auth?mode=login");
        }, 3000);
      } catch (error: any) {
        setVerificationState("error");
        setErrorMessage(error.response?.data?.message || "Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E0F5FF]">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
        {verificationState === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold">Verifying your email...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )}

        {verificationState === "success" && (
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-green-700">Email Verified!</h2>
            <p className="mt-2 text-gray-600">
              Your email has been successfully verified. Redirecting you to login...
            </p>
          </div>
        )}

        {verificationState === "error" && (
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-red-700">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{errorMessage}</p>
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => router.push("/auth?mode=login")}
                className="w-full"
              >
                Back to Login
              </Button>
              {/* TODO: Implement resend verification email functionality */}
              <Button
                variant="outline"
                onClick={() => {}}
                className="w-full"
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 