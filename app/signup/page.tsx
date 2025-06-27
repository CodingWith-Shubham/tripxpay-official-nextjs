"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/Auth";
// Define types for your context and form data
type AuthContextType = {
  currentUser: any;
  signup: (email: string, password: string) => Promise<any>;
  sendOTP: (phoneNumber: string) => Promise<any>;
  verifyOTP: (code: string) => Promise<any>;
  setupRecaptcha: () => void;
  sendVerificationEmail: () => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
};

type UserTypeContextType = {
  toggleAzenda: (isConsumer: boolean) => void;
  consumer: boolean;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  agreeTerms: boolean;
};

const SignupPage = () => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    agreeTerms: false,
  });

  // UI state
  const [emailUserdata, setEmailUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: signup form, 2: phone verification
  const [verificationCode, setVerificationCode] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | "google">(
    "email"
  );
  const [verficationSent, setVerficationSent] = useState(false);

  // Refs
  const confirmationResultRef = useRef<any>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Router
  const router = useRouter();

  // Mock context hooks - replace with your actual context implementations
  const { currentUser } = {} as AuthContextType;
  const { toggleAzenda, consumer } = {} as UserTypeContextType;

  // Get auth functions from context
  const { signInWithGoogle } = useAuth();

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!formData.agreeTerms) {
      return setError("Please agree to the terms and conditions");
    }

    try {
      setError("");
      setLoading(true);

      // Sign up with email and password
      const response = createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      toast.promise(response, {
        loading: "creating user",
        error: "failed to create user",
        success: "successfully signup",
        position: "top-right",
      });
      const userCredential = await response;
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Send verification email
      const verificationSent = sendEmailVerification(userCredential.user);
      toast.promise(verificationSent, {
        loading: "sending verification",
        error: "failed to sent verification",
        success: "verification sent successfully",
        position: "top-right",
      });

      // Set verification sent state
      const res = await verificationSent;
      toggleAzenda(true);
      setVerficationSent(true);
      setEmailUserData(userCredential.user);

      toast.success("Verification email sent! Please check your inbox.", {
        duration: 10000,
      });
    } catch (error: any) {
      console.error(error);

      // Handle specific error cases
      switch (error.code) {
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        case "(auth/email-already-in-use).":
          setError("email already exist");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
      }
    } finally {
      setLoading(false);
    }
  };

  // Add this useEffect to handle email verification
  useEffect(() => {
    if (emailUserdata) {
      const interval = setInterval(async () => {
        try {
          // Refresh the user to get latest email verification status
          await emailUserdata.reload();
          if (emailUserdata.emailVerified) {
            clearInterval(interval);
            router.push("/verificationdashboard");
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [emailUserdata, router]);

  // Handle phone signup - step 1: send OTP
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber) {
      return setError("Please enter your phone number");
    }

    if (!formData.agreeTerms) {
      return setError("Please agree to the terms and conditions");
    }

    try {
      setError("");
      setLoading(true);

      // Format phone number (Indian format)
      let phoneNumber = formData.phoneNumber.replace(/\D/g, "");
      if (phoneNumber.length === 10) {
        phoneNumber = "+91" + phoneNumber;
      } else if (phoneNumber.length === 11 && phoneNumber.startsWith("0")) {
        phoneNumber = "+91" + phoneNumber.slice(1);
      } else if (!phoneNumber.startsWith("+")) {
        toast.error(
          "Invalid phone number format. Please enter a valid mobile number (e.g., +911234567890).",
          { position: "top-right" }
        );
      }

      // Re-initialize reCAPTCHA if not already done or cleared
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "visible",
            callback: (response: any) => {
              console.log("reCAPTCHA solved", response);
            },
            "expired-callback": () => {
              window.recaptchaVerifier?.clear();
              window.recaptchaVerifier = null;
            },
          }
        );
        recaptchaVerifierRef.current = window.recaptchaVerifier;
      }

      // Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      confirmationResultRef.current = confirmation;
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
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log("Error clearing recaptcha:", e);
        }
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle phone signup - step 2: verify OTP
  const handleVerifyOTP = async () => {
    if (verificationCode.length !== 6) {
      return setError("Please enter a valid 6-digit code");
    }

    try {
      setError("");
      setLoading(true);
      // Verify the OTP
      const response = confirmationResultRef.current.confirm(verificationCode);
      toast.promise(response, {
        loading: "verifing otp",
        error: "wrong otp",
        success: "otp verified",
        position: "top-right",
      });
      const result = await response;
      if (result.user) {
        toggleAzenda(true);
        router.push("/verificationdashboard");
      }
      console.log("Phone number verified successfully", result.user);

      // Navigate to the verification dashboard after successful phone signup
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      let errorMessage = "Invalid verification code. Please try again.";
      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "The verification code is invalid.";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "The verification code has expired.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      setError("");
      setLoading(true);

      const response = signInWithGoogle();
      toast.promise(response, {
        loading: "signup with the Google",
        error: "failed to signup",
        success: "Successfully Signup",
        position: "top-right",
      });

      const result = await response;
      console.log("Google sign up successful", result.user);
      // Navigate to verification dashboard after successful Google signup
      if (result) {
        toggleAzenda(true);
        router.push("/verificationdashboard");
      }
    } catch (error: any) {
      console.error(error);

      // Handle specific error cases
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Sign-up cancelled");
          break;
        case "auth/popup-blocked":
          setError("Popup blocked. Please allow popups and try again");
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with the same email address but different sign-in credentials."
          );
          break;
        default:
          setError("Failed to sign up with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  Create your account
                </h2>
                <p className="text-gray-400">
                  Join TripxPay and revolutionize your travel payments
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

          {/* Login Method Toggle */}
          {step === 1 && (
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
                onClick={() => setLoginMethod("google")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  loginMethod === "google"
                    ? "bg-teal-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-750"
                }`}
              >
                Google
              </button>
            </div>
          )}

          {/* Step 1: Signup Form */}
          {step === 1 && (
            <>
              {loginMethod === "email" && (
                <form onSubmit={handleEmailSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="First name"
                      />
                    </div>
                    <div className="group">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

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
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                      placeholder="Create a password"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="flex items-center group cursor-pointer">
                    <input
                      id="agreeTermsEmail"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-teal-500 focus:ring-teal-500 transition-all duration-300 hover:scale-110"
                    />
                    <label
                      htmlFor="agreeTermsEmail"
                      className="ml-2 block text-sm text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms-conditions"
                        className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-teal-500 hover:text-teal-400 transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {verficationSent ? (
                    <div className="space-y-4">
                      <div className="bg-teal-900/30 border border-teal-700 text-teal-300 px-4 py-3 rounded-lg mb-4">
                        Verification email sent to {formData.email}. Please
                        check your inbox.
                      </div>
                      <button
                        onClick={() =>
                          window.open(
                            `https://mail.google.com/mail/u/?authuser=${formData.email}`,
                            "_blank"
                          )
                        }
                        className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                      >
                        <span className="flex items-center justify-center">
                          Open Gmail <FiArrowUpRight className="ml-2" />
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setVerficationSent(false);
                          setFormData((prev) => ({
                            ...prev,
                            password: "",
                          }));
                        }}
                        className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Try different email
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                    >
                      {loading ? (
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
                          Signing up...
                        </span>
                      ) : (
                        "Sign up with Email"
                      )}
                    </button>
                  )}
                </form>
              )}

              {loginMethod === "phone" && (
                <form onSubmit={handlePhoneSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label
                        htmlFor="firstNamePhone"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        First Name
                      </label>
                      <input
                        id="firstNamePhone"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="First name"
                      />
                    </div>
                    <div className="group">
                      <label
                        htmlFor="lastNamePhone"
                        className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastNamePhone"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="phoneNumberSignup"
                      className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phoneNumberSignup"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                      placeholder="+91 1234567890"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your mobile number (e.g., +911234567890)
                    </p>
                  </div>

                  <div className="flex items-center group cursor-pointer">
                    <input
                      id="agreeTermsPhone"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-teal-500 focus:ring-teal-500 transition-all duration-300 hover:scale-110"
                    />
                    <label
                      htmlFor="agreeTermsPhone"
                      className="ml-2 block text-sm text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms-conditions"
                        className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-teal-500 hover:text-teal-400 transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.agreeTerms}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                  >
                    {loading ? (
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
                        Sending Code...
                      </span>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>

                  <div
                    id="recaptcha-container"
                    className="flex justify-center h-[78px]"
                  ></div>
                </form>
              )}

              {loginMethod === "google" && (
                <div className="py-4">
                  <button
                    onClick={handleGoogleSignup}
                    disabled={loading}
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
                    {loading ? "Signing up..." : "Continue with Google"}
                  </button>
                  <div className="flex items-center group cursor-pointer mt-4">
                    <input
                      id="agreeTermsGoogle"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-teal-500 focus:ring-teal-500 transition-all duration-300 hover:scale-110"
                    />
                    <label
                      htmlFor="agreeTermsGoogle"
                      className="ml-2 block text-sm text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms-conditions"
                        className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-teal-500 hover:text-teal-400 transition-all duration-300 hover:scale-105 inline-block"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
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
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                  placeholder="Enter 6-digit code"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Code sent to {formData.phoneNumber}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
                >
                  {loading ? (
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
                  onClick={() => handlePhoneSignup(new Event("click") as any)}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Resend Code
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 px-4 text-gray-400 hover:text-white font-medium transition-colors duration-200"
                >
                  Back to Signup Options
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;
