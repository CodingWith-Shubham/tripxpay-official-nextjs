"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const MerchantSignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fill the fields first", { position: "top-right" });
      return;
    }
    try {
      const signInMerchant = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (signInMerchant) {
        toast.success("Account created! Redirecting...", {
          position: "top-right",
        });
        router.replace("/merchantverificationdashboard");
      }
    } catch (errorSignIn: any) {
      const msg = errorSignIn.message?.toLowerCase() || "";
      if (msg.includes("already")) {
        toast.error(
          "This email is already used in our consumer section. Use a different email!",
          {
            duration: 10000,
            position: "top-right",
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #00FFB4",
            },
          }
        );
      } else if (msg.includes("invalid")) {
        setError("Merchant data not found, register first.");
        toast.success("Redirecting to the merchant signup", {
          position: "top-right",
        });
        router.replace("/merchantsignup");
      } else {
        setError("An error occurred. Please try again.");
        toast.error("Signup failed. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background effects matching HomePage */}
      {/* Top-left glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />

      {/* Top-right spread glow */}
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />

      {/* Optional grid dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />

        <div className="flex-grow flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-4">
                <BackButton />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2">
                Merchant SignUp
              </h2>
              <p className="text-gray-400">
                Access your TripxPay merchant dashboard
              </p>
            </div>
            {error && <div className="p-4 bg-red-400">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1 group-hover:text-teal-400 transition-colors duration-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                  placeholder="Enter your email"
                />
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-teal-500 hover:text-teal-400 transition-all duration-300 hover:scale-105"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 hover:bg-gray-750 hover:border-gray-600 hover:shadow-lg hover:shadow-teal-500/10"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center group cursor-pointer">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-teal-500 focus:ring-teal-500 transition-all duration-300 hover:scale-110"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-300 group-hover:text-teal-400 transition-colors duration-300"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 transform"
              >
                Sign Up as Merchant
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have a merchant account?{" "}
                <Link
                  href="/merchant-login"
                  className="text-teal-500 hover:text-teal-400 font-medium transition-all duration-300 hover:scale-105 inline-block"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MerchantSignUpPage;
