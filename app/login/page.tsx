"use client";

import { useState, useRef, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/Auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  applyActionCode,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
// TypeScript interfaces
interface FormData {
  email: string;
  password: string;
  phoneNumber: string;
  rememberMe: boolean;
}

interface PhoneUser {
  confirm: (code: string) => Promise<any>;
}

type LoginMethod = "email" | "phone" | "gmail" | "verifyEmail";

// Helper to set session cookie
const setSessionCookie = async (user: User) => {
  try {
    const response = await fetch("/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to set session.");
    }
  } catch (error) {
    console.error("Failed to set session cookie:", error);
    // We can choose to show a toast here if needed, but for now, we'll log it.
  }
};

const setConsumer = async () => {
  try {
    const response = await fetch(`/api/token`, { method: "POST" });
    const { message } = await response.json();
    if (message) {
      toast.message(message, {
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
        position: "top-right",
      });
    }
  } catch (error) {
    console.log("error while saving the token", (error as Error).message);
  }
};
const LoginPageContent = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    phoneNumber: "",
    rememberMe: false,
  });

  // Context values
  const authcontext = useAuth();
  const currentUser = authcontext?.currentUser;
  const [phoneUser, setPhoneUser] = useState<PhoneUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [step, setStep] = useState<number>(1); // 1: login form, 2: phone verification
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const searchParams = useSearchParams();
  const [oobCode, setOobcode] = useState<string>("");
  const [showInvitationPopup, setShowInvitationPopup] =
    useState<boolean>(false);
  const [merchantRelParam, setMerchantRelParam] = useState<string>("");
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  const router = useRouter();
  const confirmationResultRef = useRef<any>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Auth context

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");
    if (mode) {
      setLoginMethod("verifyEmail");
    }
    if (oobCode) {
      setOobcode(oobCode);
    }
  }, [searchParams]);

  useEffect(() => {
    const merchantRel = searchParams.get("merchantRel");
    if (merchantRel) {
      setMerchantRelParam(merchantRel);
      localStorage.setItem("merchantRel", merchantRel);

      // If user is already logged in, show popup
      if (currentUser) {
        setShowInvitationPopup(true);
      }
    }
  }, [searchParams, currentUser]);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    };
  }, []);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      setEmailError("");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Add email validation when email field changes
    if (name === "email") {
      validateEmail(value);
    }
  };

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return;
    }

    startTransition(async () => {
      try {
        setError("");

        const result = fetch(
          `/api/loginemail?email=${formData.email}&password=${formData.password}`,
          { method: "POST" }
        );

        toast.promise(result, {
          loading: "Signing in with email...",
          error: "Failed to sign in with email",
          success: "Successfully signed in with email",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const response = await result;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }

        const { user } = await response.json();
        // Set session cookie
        await setSessionCookie(user);

        // Handle merchant relationship if exists
        if (merchantRelParam) {
          await handleMerchantRelationship(user.user.uid);
        }

        // Check user status and redirect
        await checkUserStatusAndRedirect(user?.user.uid);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Login failed. Please try again.");
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    });
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    startTransition(async () => {
      try {
        setError("");
        const provider = new GoogleAuthProvider();
        provider.addScope("email");
        provider.addScope("profile");

        // Create a promise wrapper for toast
        const googleSignInPromise = signInWithPopup(auth, provider);

        toast.promise(googleSignInPromise, {
          loading: "Signing in with Google...",
          error: "Failed to sign in with Google",
          success: "Successfully signed in with Google",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const result = await googleSignInPromise;
        const user = result.user;

        // Set session cookie
        await setSessionCookie(user);

        // Handle merchant relationship if exists
        if (merchantRelParam) {
          await handleMerchantRelationship(user?.uid);
        }

        // Check user status and redirect
        await checkUserStatusAndRedirect(user?.uid);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Google login failed. Please try again.");
      }
    });
  };

  // Handle phone login - step 1: send OTP
  const handlePhoneLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.phoneNumber) {
      return setError("Please enter your phone number");
    }

    startTransition(async () => {
      try {
        setError("");

        // Format phone number (Indian format)
        let phoneNumber = formData.phoneNumber.replace(/\D/g, "");
        if (phoneNumber.length === 10) {
          phoneNumber = "+91" + phoneNumber;
        } else if (phoneNumber.length === 11 && phoneNumber.startsWith("0")) {
          phoneNumber = "+91" + phoneNumber.slice(1);
        } else if (!phoneNumber.startsWith("+91")) {
          throw new Error(
            "Invalid phone number format. Please enter a valid Indian mobile number."
          );
        }

        // Clear any existing reCAPTCHA
        if ((window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        }

        // Initialize reCAPTCHA
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            "expired-callback": () => {
              console.log("reCAPTCHA expired");
              setError("reCAPTCHA expired. Please try again.");
              if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
              }
            },
          }
        );

        // Store the verifier
        (window as any).recaptchaVerifier = recaptchaVerifier;
        recaptchaVerifierRef.current = recaptchaVerifier;

        // Send OTP
        const confirmation = signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );

        toast.promise(confirmation, {
          loading: "Sending OTP...",
          success: "OTP sent successfully!",
          error: "Failed to send OTP",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        // Store the confirmation result properly
        const user = await confirmation;
        setPhoneUser(user);
        confirmationResultRef.current = user;

        setStep(2); // Move to verification step
        setError(""); // Clear any previous errors
      } catch (error: any) {
        console.error("Phone verification failed:", error);
        let errorMessage =
          error.message || "Failed to send OTP. Please try again.";
        if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.code === "auth/invalid-phone-number") {
          errorMessage = "The phone number is invalid.";
        }
        setError(errorMessage);

        // Reset recaptcha on error
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {
            console.log("Error clearing recaptcha:", e);
          }
          (window as any).recaptchaVerifier = null;
        }
      }
    });
  };

  // Handle phone login - step 2: verify OTP
  const handleVerifyOTP = async () => {
    if (verificationCode.length !== 6) {
      return setError("Please enter a valid 6-digit code");
    }

    startTransition(async () => {
      try {
        setError("");

        const confirmationResult = phoneUser || confirmationResultRef.current;

        if (
          !confirmationResult ||
          typeof confirmationResult.confirm !== "function"
        ) {
          throw new Error(
            "Invalid confirmation result. Please try sending the code again."
          );
        }

        // Verify OTP
        const otpResult = await confirmationResult.confirm(verificationCode);
        const user = otpResult.user;

        // Set session cookie
        await setSessionCookie(user);

        // Check if user exists in database
        const checkExistence = fetch(`/api/checkuser?uid=${user.uid}`, {
          method: "POST",
        });

        toast.promise(checkExistence, {
          loading: "Checking your status",
          error: "Failed to check your status",
          success: "Successfully checked the status",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const response = await checkExistence;
        const data = await response.json();

        // Handle merchantRel if it exists in localStorage
        const merchantRel = localStorage.getItem("merchantRel");
        if (merchantRel) {
          try {
            setInviteLoading(true);
            const updateResult = fetch(
              `/api/updatemerchantrel?userid=${user?.uid}&merchantid=${merchantRel}`,
              { method: "POST" }
            );

            toast.promise(updateResult, {
              loading: "Updating merchant relationship...",
              error: "Failed to update merchant relationship",
              success: "Merchant relationship updated successfully",
              position: "top-right",
              style: {
                backgroundColor: "#172533",
                border: "#FBAE04",
                color: "#fff",
              },
            });

            await updateResult;
            localStorage.removeItem("merchantRel");
          } catch (error: any) {
            console.error("Failed to update merchantRel:", error);
            toast.error("Failed to update merchant relationship", {
              style: {
                backgroundColor: "#172533",
                border: "#FBAE04",
                color: "#fff",
              },
            });
            // Continue with navigation even if merchantRel update fails
          } finally {
            setInviteLoading(false);
          }
        }

        if (data.success) {
          await setConsumer();
          router.push("/verified");
        } else {
          await setConsumer();
          router.push(
            `/verificationdashboard?phoneNumber=${formData.phoneNumber}`
          );
        }
      } catch (error: any) {
        console.error("OTP verification error:", error);

        if (error.code === "auth/invalid-verification-code") {
          setError("Invalid verification code. Please try again.");
        } else if (error.code === "auth/code-expired") {
          setError("Verification code has expired. Please request a new one.");
        } else {
          setError(error.message || "Failed to verify code. Please try again.");
        }
      }
    });
  };

  // Handle resend OTP
  const handleResendCode = async () => {
    if (!formData.phoneNumber) {
      return setError("Please enter your phone number");
    }

    // Just call handlePhoneLogin again with a fake event
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    await handlePhoneLogin(fakeEvent);
  };

  // Helper function to handle merchant relationship
  const handleMerchantRelationship = async (userId: string) => {
    try {
      setInviteLoading(true);
      const { success } = await fetch(
        `/api/checkmerchant?merchantid=${userId}`,
        { method: "POST" }
      ).then((res) => res.json());
      if (success) {
        toast.error("This user is already registered in the merchant part.", {
          duration: 10000,
        });
      } else {
        const result = fetch(
          `/api/updatemerchantrel?userid=${userId}&merchantid=${merchantRelParam}`,
          { method: "POST" }
        );

        toast.promise(result, {
          loading: "Updating merchant relationship...",
          error: "Failed to update merchant relationship",
          success: "Merchant realation updated successfully",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const response = await result;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update merchant relationship"
          );
        }

        localStorage.removeItem("merchantRel");
      }
    } catch (error: any) {
      console.error("Failed to update merchantRel:", error);
      toast.error(error.message || "Failed to update merchant relationship", {
        style: { backgroundColor: "#172533", border: "#FBAE04", color: "#fff" },
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // Helper function to check user status and redirect
  const checkUserStatusAndRedirect = async (userId: string) => {
    try {
      console.log(
        "this is the uid fo the user when try to login with the ",
        userId
      );
      const { success } = await fetch(
        `/api/checkmerchant?merchantid=${userId}`,
        { method: "POST" }
      ).then((res) => res.json());
      if (success) {
        toast.error("This user is already registered in the merchant part.", {
          duration: 10000,
        });
      } else {
        const result = fetch(`/api/checkuser?uid=${userId}`, {
          method: "POST",
        });

        toast.promise(result, {
          loading: "Checking your account status...",
          error: "Failed to check your status",
          success: "Status verified",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const response = await result;
        const data = await response.json();

        if (data.success) {
          await setConsumer();
          router.push("/verified");
        } else {
          await setConsumer();
          router.push("/verificationdashboard");
        }
      }
    } catch (error: any) {
      console.error("Failed to check user status:", error);
      setError(error.message || "Failed to check user status");
      await setConsumer();
      router.push("/verificationdashboard");
    }
  };

  // Handle password reset
  const handleForgotPassword = async () => {
    if (!formData.email) {
      return setError("Please enter your email address first");
    }

    startTransition(async () => {
      try {
        const result = fetch("/api/resetpassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        });

        toast.promise(result, {
          loading: "Sending reset email...",
          error: "Failed to send reset email",
          success: "Password reset email sent! Check your inbox.",
          position: "top-right",
          style: {
            backgroundColor: "#172533",
            border: "#FBAE04",
            color: "#fff",
          },
        });

        const response = await result;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send reset email");
        }
      } catch (error: any) {
        console.error("Password reset failed:", error);
        setError(error.message || "Failed to send password reset email");
      }
    });
  };

  useEffect(() => {
    const verifyEmail = async () => {
      if (loginMethod === "verifyEmail" && oobCode) {
        try {
          const verifying = applyActionCode(auth, oobCode);

          toast.promise(verifying, {
            loading: "verifying you email",
            error: "failed to verify",
            success: "successfully verified your email",
            position: "top-right",
            style: {
              backgroundColor: "#172533",
              border: "#FBAE04",
              color: "#fff",
            },
          });
          const isVeerified = await verifying;

          router.push("/verificationdashboard");

          // You might want to redirect or update UI state here
          setLoginMethod("email"); // Switch to email login form
        } catch (error: any) {
          console.error("Email verification failed:", error);
          setError(
            "Email verification failed. The link may have expired or already been used."
          );

          toast.error("Email verification failed", {
            position: "top-right",
            style: {
              background: "#1f2937",
              color: "#ffffff",
              border: "1px solid #FF0000",
            },
          });
        }
      }
    };

    verifyEmail();
  }, [loginMethod, oobCode, router]);

  useEffect(() => {
    const merchantRel = searchParams.get("merchantRel");
    if (merchantRel) {
      // Check if merchantRel matches current user's UID
      if (currentUser && merchantRel === currentUser.uid) {
        setError("You cannot create a merchant relationship with yourself");
        return;
      }

      setMerchantRelParam(merchantRel);
      localStorage.setItem("merchantRel", merchantRel);

      // If user is already logged in, show popup
      if (currentUser) {
        setShowInvitationPopup(true);
      }
    }
  }, [searchParams, currentUser]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />

        {/* Background gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] md:bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0 md:top-4" />

        <div className="flex-grow flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <BackButton />

              {step === 1 && (
                <>
                  <h2 className="text-3xl md:text-[45px] font-bold mb-2">
                    Welcome back
                  </h2>
                  <p className="text-gray-400">
                    Sign in to your TripxPay account
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-3xl md:text-[45px] font-bold mb-2">
                    Verify your phone
                  </h2>
                  <p className="text-gray-400">
                    Enter the code sent to {formData.phoneNumber}
                  </p>
                </>
              )}
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                {error}
              </div>
            )}

            {/* Step 1: Login Form */}
            {step === 1 && (
              <>
                {/* Login Method Toggle */}
                <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      loginMethod === "email"
                        ? "bg-teal-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-750"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setLoginMethod("phone")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      loginMethod === "phone"
                        ? "bg-teal-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-750"
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    onClick={() => setLoginMethod("gmail")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      loginMethod === "gmail"
                        ? "bg-teal-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-750"
                    }`}
                  >
                    Gmail
                  </button>
                </div>

                {/* Gmail Login */}
                {loginMethod === "gmail" && (
                  <div className="py-4">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isPending}
                      className="w-full flex items-center justify-center py-3 px-4 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-4 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/25 transform"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {isPending ? "Signing in..." : "Continue with Google"}
                    </button>
                    <p className="text-sm text-center text-gray-400">
                      We'll securely log you in with your Google account
                    </p>
                  </div>
                )}

                {/* Email Login Form */}
                {loginMethod === "email" && (
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div className="group">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => validateEmail(formData.email)}
                        required
                        className={`w-full px-4 py-3 bg-gray-800 border ${
                          emailError ? "border-red-500" : "border-gray-700"
                        } rounded-lg focus:outline-none focus:ring-2 ${
                          emailError
                            ? "focus:ring-red-500"
                            : "focus:ring-teal-500"
                        } transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10`}
                        placeholder="Enter your email"
                        disabled={isPending}
                      />
                      {emailError && (
                        <p className="mt-1 text-sm text-red-500 animate-fadeIn">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-teal-500 hover:text-teal-400 transition-all duration-300 hover:scale-105"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="Enter your password"
                        disabled={isPending}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center group cursor-pointer">
                        <input
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-teal-500 focus:ring-teal-500 transition-all duration-300 hover:scale-110"
                          disabled={isPending}
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 block text-sm text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </form>
                )}

                {/* Verify email */}
                {loginMethod === "verifyEmail" && (
                  <div className="space-y-6 py-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-teal-400 mb-2">
                        Verifying Your Email
                      </h3>
                      <p className="text-gray-400">
                        Please wait while we verify your email address...
                      </p>
                    </div>

                    {isPending && (
                      <div className="flex justify-center">
                        <svg
                          className="animate-spin h-8 w-8 text-teal-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fadeIn">
                        {error}
                      </div>
                    )}

                    <div className="text-center">
                      <button
                        onClick={() => setLoginMethod("email")}
                        className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone Login Form */}
                {loginMethod === "phone" && (
                  <form onSubmit={handlePhoneLogin} className="space-y-6">
                    <div className="group">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          // Update both form state and context
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumber: value,
                          }));
                        }}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="+91 1234567890"
                        disabled={isPending}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter your 10-digit Indian mobile number
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                    >
                      {isPending ? "Sending Code..." : "Send Verification Code"}
                    </button>

                    {/* Updated reCAPTCHA container */}
                    <div
                      id="recaptcha-container"
                      className="flex justify-center min-h-[78px] items-center"
                    ></div>
                  </form>
                )}
              </>
            )}

            {/* Step 2: Phone Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="group">
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                  >
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.slice(0, 6))
                    }
                    maxLength={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                    placeholder="Enter 6-digit code"
                    disabled={isPending}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Code sent to {formData.phoneNumber}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleVerifyOTP}
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <button
                    onClick={handleResendCode}
                    disabled={isPending}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Resend Code
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 px-4 text-gray-400 hover:text-white font-medium transition-colors duration-200"
                  >
                    Back to Login Options
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href={
                      merchantRelParam
                        ? `/signup?merchantRel=${merchantRelParam}`
                        : "/signup"
                    }
                    className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}

            {showInvitationPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-teal-500">
                  <h3 className="text-xl font-bold mb-4">
                    Accept Merchant Invitation
                  </h3>

                  {/* Add this error display */}
                  {merchantRelParam === currentUser?.uid && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
                      You cannot create a merchant relationship with yourself
                    </div>
                  )}

                  <p className="mb-6 text-gray-300">
                    Do you want to accept this merchant relationship?
                  </p>
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => {
                        setShowInvitationPopup(false);
                        localStorage.removeItem("merchantRel");
                      }}
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors duration-200 w-full sm:w-auto"
                    >
                      {error.toLowerCase().includes("yourself")
                        ? "Close"
                        : "Decline"}
                    </button>
                    {!error.toLowerCase().includes("yourself") ? (
                      <button
                        onClick={async () => {
                          try {
                            // Add this validation check
                            if (merchantRelParam === currentUser?.uid) {
                              setError(
                                "You cannot create a merchant relationship with yourself"
                              );
                              return;
                            }

                            setInviteLoading(true);

                            // Update merchant relationship
                            const updateResult = fetch(
                              `/api/updatemerchantrel?userid=${
                                currentUser!.uid
                              }&merchantid=${merchantRelParam}`,
                              { method: "POST" }
                            );

                            toast.promise(updateResult, {
                              loading: "Updating merchant relationship...",
                              error: "Failed to update merchant relationship",
                              success:
                                "Merchant relationship updated successfully",
                              position: "top-right",
                              style: {
                                backgroundColor: "#172533",
                                border: "#FBAE04",
                                color: "#fff",
                              },
                            });

                            const updateResponse = await updateResult;

                            if (!updateResponse.ok) {
                              const errorData = await updateResponse.json();
                              throw new Error(
                                errorData.message ||
                                  "Failed to update merchant relationship"
                              );
                            }

                            // Check user status and redirect
                            await checkUserStatusAndRedirect(currentUser!.uid);
                          } catch (error: any) {
                            console.error(
                              "Failed to accept invitation:",
                              error
                            );
                            setError(
                              error.message || "Failed to accept invitation"
                            );
                          } finally {
                            setInviteLoading(false);
                            setShowInvitationPopup(false);
                          }
                        }}
                        className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-600 transition-colors duration-200 w-full sm:w-auto"
                      >
                        {inviteLoading ? "Accepting..." : "Accept"}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </Suspense>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="animate-bounce">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
};
export default LoginPage;
