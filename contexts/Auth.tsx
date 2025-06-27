"use client";
import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  GoogleAuthProvider,
  PhoneAuthProvider,
  linkWithCredential,
  signInWithCredential,
  signInWithPopup,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier?: any;
    recaptchaWidgetId?: any;
  }
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  setupRecaptcha: (containerId: any) => any;
  sendOTP: (
    phoneNumber: number | string,
    recaptchaVerifier: any
  ) => Promise<any>;
  verifyOTP: (confirmationResult: any, otp: string) => Promise<any>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isEmailVerified: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  async function signup(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(userCredential.user);

      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Login with email and password
  async function login(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Logout current user
  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  // Setup reCAPTCHA verifier
  const setupRecaptcha = (containerId: any) => {
    try {
      // Clear any existing verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Create new verifier with explicit configuration
      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible", // or 'normal' if you want visible reCAPTCHA
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("reCAPTCHA expired");
          verifier.clear();
        },
        "error-callback": (error: any) => {
          // Error occurred. Reset reCAPTCHA.
          console.error("reCAPTCHA error:", (error as Error).message);
          verifier.clear();
        },
      });

      // Render the reCAPTCHA widget
      verifier.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
      });

      return verifier;
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      return null;
    }
  };

  // Send OTP for phone verification
  async function sendOTP(phoneNumber: number | string, recaptchaVerifier: any) {
    try {
      if (!recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }

      return await signInWithPhoneNumber(
        auth,
        String(phoneNumber),
        recaptchaVerifier
      );
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  // Verify OTP for phone authentication
  async function verifyOTP(confirmationResult: any, otp: string) {
    try {
      if (!confirmationResult) {
        throw new Error(
          "No confirmation result available. Please request OTP first."
        );
      }

      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP.");
      }

      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otp
      );

      let result;
      if (auth.currentUser) {
        // Link phone to existing user
        result = await linkWithCredential(auth.currentUser, credential);
      } else {
        // Sign in with phone
        result = await signInWithCredential(auth, credential);
      }

      // Clean up recaptcha
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      return result;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  // Send email verification
  function sendVerificationEmail() {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in");
    }
    return sendEmailVerification(auth.currentUser);
  }

  // Reset password
  async function resetPassword(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  // Check if email is verified
  function isEmailVerified() {
    return auth.currentUser?.emailVerified || false;
  }

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    sendVerificationEmail,
    resetPassword,
    isEmailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
